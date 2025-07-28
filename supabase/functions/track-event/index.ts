
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Track event function called with method:', req.method)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData = await req.json()
    console.log('Request data:', requestData)
    
    const { tracking_code, event_type, visitor_id, session_id, page_url, referrer, user_agent, data } = requestData

    if (!tracking_code) {
      console.error('Missing tracking code')
      return new Response(JSON.stringify({ error: 'Missing tracking code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get website by tracking code
    const { data: website, error: websiteError } = await supabase
      .from('websites')
      .select('*')
      .eq('tracking_code', tracking_code)
      .single()

    if (websiteError || !website) {
      console.error('Website not found for tracking code:', tracking_code, websiteError)
      return new Response(JSON.stringify({ error: 'Invalid tracking code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Website found:', website.name)

    // Check if website is active
    if (!website.is_active) {
      console.log('Website is not active')
      return new Response(JSON.stringify({ error: 'Website tracking is disabled' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get IP address
    const ip = req.headers.get('cf-connecting-ip') || 
               req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'

    // Simple bot detection
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i, /java/i, /go-http/i,
      /googlebot/i, /bingbot/i, /slurp/i, /duckduckbot/i, /baiduspider/i, /yandexbot/i, /facebookexternalhit/i,
      /twitterbot/i, /linkedinbot/i, /whatsapp/i, /telegrambot/i, /discordbot/i, /slackbot/i, /headless/i,
      /phantom/i, /selenium/i, /webdriver/i, /playwright/i, /puppeteer/i
    ]

    const isBot = botPatterns.some(pattern => pattern.test(user_agent || ''))
    console.log('Bot detection result:', isBot)

    // Parse user agent for device info
    const isMobile = /mobile|android|iphone|ipad|tablet/i.test(user_agent || '')
    const isTablet = /tablet|ipad/i.test(user_agent || '')
    const deviceType = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop'

    // Extract browser info
    const getBrowser = (ua: string) => {
      if (ua.includes('Chrome')) return 'Chrome'
      if (ua.includes('Firefox')) return 'Firefox'
      if (ua.includes('Safari')) return 'Safari'
      if (ua.includes('Edge')) return 'Edge'
      if (ua.includes('Opera')) return 'Opera'
      return 'Unknown'
    }

    // Extract OS info
    const getOS = (ua: string) => {
      if (ua.includes('Windows')) return 'Windows'
      if (ua.includes('Mac')) return 'macOS'
      if (ua.includes('Linux')) return 'Linux'
      if (ua.includes('Android')) return 'Android'
      if (ua.includes('iOS')) return 'iOS'
      return 'Unknown'
    }

    const browser = getBrowser(user_agent || '')
    const os = getOS(user_agent || '')

    // Mock geolocation (in real implementation, you'd use a GeoIP service)
    const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'China']
    const cities = ['New York', 'London', 'Toronto', 'Berlin', 'Paris', 'Tokyo', 'Sydney', 'São Paulo', 'Mumbai', 'Shanghai']
    const country = countries[Math.floor(Math.random() * countries.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]

    // If it's a bot, record the detection
    if (isBot) {
      console.log('Bot detected, recording detection')
      await supabase
        .from('bot_detections')
        .insert({
          website_id: website.id,
          ip_address: ip,
          user_agent: user_agent || '',
          detection_reason: 'User agent pattern match',
          is_blocked: true
        })

      return new Response(JSON.stringify({ 
        success: true, 
        blocked: true, 
        reason: 'Bot detected' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Insert analytics event
    console.log('Inserting analytics event for website:', website.name)
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        website_id: website.id,
        event_type: event_type || 'page_view',
        visitor_id: visitor_id || 'anonymous',
        session_id: session_id || 'session_' + Date.now(),
        page_url: page_url || '',
        referrer: referrer || '',
        user_agent: user_agent || '',
        ip_address: ip,
        country,
        city,
        device_type: deviceType,
        browser,
        os,
        is_bot: false
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return new Response(JSON.stringify({ error: 'Failed to insert event' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Event inserted successfully')
    return new Response(JSON.stringify({ 
      success: true, 
      blocked: false,
      device_type: deviceType,
      browser,
      os,
      country,
      city
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in track-event function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
