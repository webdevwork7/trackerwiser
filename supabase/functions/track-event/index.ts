
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { event_type, visitor_id, session_id, website_id, page_url, referrer, user_agent, ip_address, country, city, device_type, browser, os } = await req.json()

    // Simple bot detection based on user agent
    const botPatterns = [
      'bot', 'crawler', 'spider', 'scraper', 'automated', 'pingdom', 'monitoring'
    ]
    
    const isBot = botPatterns.some(pattern => 
      user_agent?.toLowerCase().includes(pattern)
    )

    // Insert analytics event
    const { error: analyticsError } = await supabase
      .from('analytics_events')
      .insert({
        event_type,
        visitor_id,
        session_id,
        website_id,
        page_url,
        referrer,
        user_agent,
        ip_address,
        country,
        city,
        device_type,
        browser,
        os,
        is_bot: isBot
      })

    if (analyticsError) {
      console.error('Analytics error:', analyticsError)
    }

    // If bot detected, also insert bot detection record
    if (isBot) {
      await supabase
        .from('bot_detections')
        .insert({
          website_id,
          ip_address,
          user_agent,
          detection_reason: 'User agent pattern matching',
          is_blocked: false
        })
    }

    return new Response(
      JSON.stringify({ success: true, is_bot: isBot }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
