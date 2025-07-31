import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Function to get real IP address
function getRealIP(req: Request): string {
  // Check various headers in order of reliability
  const headers = [
    "cf-connecting-ip", // Cloudflare
    "x-forwarded-for", // Standard proxy header
    "x-real-ip", // Nginx proxy
    "x-client-ip", // Some proxies
    "x-forwarded", // Some proxies
    "forwarded-for", // Some proxies
    "forwarded", // RFC 7239
  ];

  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      // Handle comma-separated IPs (take the first one)
      const ip = value.split(",")[0].trim();
      if (ip && ip !== "unknown" && ip !== "127.0.0.1") {
        return ip;
      }
    }
  }

  return "unknown";
}

// Function to get geolocation from IP
async function getGeolocation(
  ip: string
): Promise<{ country: string; city: string }> {
  if (
    ip === "unknown" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return { country: "Unknown", city: "Unknown" };
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,message,country,city,regionName`
    );
    const data = await response.json();

    if (data.status === "success") {
      return {
        country: data.country || "Unknown",
        city: data.city || "Unknown",
      };
    }
  } catch (error) {
    console.error("Error fetching geolocation:", error);
  }

  return { country: "Unknown", city: "Unknown" };
}

// Improved browser detection
function getBrowserInfo(userAgent: string): {
  browser: string;
  version: string;
} {
  const ua = userAgent.toLowerCase();

  // Chrome (including Chromium-based browsers)
  if (ua.includes("chrome") && !ua.includes("edg")) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    return { browser: "Chrome", version: match ? match[1] : "Unknown" };
  }

  // Firefox
  if (ua.includes("firefox")) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    return { browser: "Firefox", version: match ? match[1] : "Unknown" };
  }

  // Safari
  if (ua.includes("safari") && !ua.includes("chrome")) {
    const match = userAgent.match(/Version\/(\d+)/);
    return { browser: "Safari", version: match ? match[1] : "Unknown" };
  }

  // Edge
  if (ua.includes("edg")) {
    const match = userAgent.match(/Edg\/(\d+)/);
    return { browser: "Edge", version: match ? match[1] : "Unknown" };
  }

  // Opera
  if (ua.includes("opera") || ua.includes("opr")) {
    const match = userAgent.match(/(?:Opera|OPR)\/(\d+)/);
    return { browser: "Opera", version: match ? match[1] : "Unknown" };
  }

  // Internet Explorer
  if (ua.includes("msie") || ua.includes("trident")) {
    const match = userAgent.match(/MSIE (\d+)/);
    return {
      browser: "Internet Explorer",
      version: match ? match[1] : "Unknown",
    };
  }

  return { browser: "Unknown", version: "Unknown" };
}

// Improved OS detection
function getOSInfo(userAgent: string): { os: string; version: string } {
  const ua = userAgent.toLowerCase();

  // Windows
  if (ua.includes("windows")) {
    if (ua.includes("windows nt 10.0")) return { os: "Windows", version: "10" };
    if (ua.includes("windows nt 6.3")) return { os: "Windows", version: "8.1" };
    if (ua.includes("windows nt 6.2")) return { os: "Windows", version: "8" };
    if (ua.includes("windows nt 6.1")) return { os: "Windows", version: "7" };
    return { os: "Windows", version: "Unknown" };
  }

  // macOS
  if (ua.includes("mac os x")) {
    const match = userAgent.match(/Mac OS X (\d+)_(\d+)/);
    if (match) {
      return { os: "macOS", version: `${match[1]}.${match[2]}` };
    }
    return { os: "macOS", version: "Unknown" };
  }

  // iOS
  if (ua.includes("iphone") || ua.includes("ipad")) {
    const match = userAgent.match(/OS (\d+)_(\d+)/);
    if (match) {
      return { os: "iOS", version: `${match[1]}.${match[2]}` };
    }
    return { os: "iOS", version: "Unknown" };
  }

  // Android
  if (ua.includes("android")) {
    const match = userAgent.match(/Android (\d+)/);
    return { os: "Android", version: match ? match[1] : "Unknown" };
  }

  // Linux
  if (ua.includes("linux")) {
    return { os: "Linux", version: "Unknown" };
  }

  return { os: "Unknown", version: "Unknown" };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Track event function called with method:", req.method);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData = await req.json();
    console.log("Request data:", requestData);

    const {
      tracking_code,
      event_type,
      visitor_id,
      session_id,
      page_url,
      referrer,
      user_agent,
      data,
    } = requestData;

    if (!tracking_code) {
      console.error("Missing tracking code");
      return new Response(JSON.stringify({ error: "Missing tracking code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get website by tracking code
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .select("*")
      .eq("tracking_code", tracking_code)
      .single();

    if (websiteError || !website) {
      console.error(
        "Website not found for tracking code:",
        tracking_code,
        websiteError
      );
      return new Response(JSON.stringify({ error: "Invalid tracking code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Website found:", website.name);

    // Check if website is active
    if (!website.is_active) {
      console.log("Website is not active");
      return new Response(
        JSON.stringify({ error: "Website tracking is disabled" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get real IP address
    const ip = getRealIP(req);
    console.log("Detected IP:", ip);

    // Get geolocation from IP
    const { country, city } = await getGeolocation(ip);
    console.log("Geolocation:", { country, city });

    // Simple bot detection
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /go-http/i,
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
      /baiduspider/i,
      /yandexbot/i,
      /facebookexternalhit/i,
      /twitterbot/i,
      /linkedinbot/i,
      /whatsapp/i,
      /telegrambot/i,
      /discordbot/i,
      /slackbot/i,
      /headless/i,
      /phantom/i,
      /selenium/i,
      /webdriver/i,
      /playwright/i,
      /puppeteer/i,
    ];

    const isBot = botPatterns.some((pattern) => pattern.test(user_agent || ""));
    console.log("Bot detection result:", isBot);

    // Parse user agent for device info
    const isMobile = /mobile|android|iphone|ipad|tablet/i.test(
      user_agent || ""
    );
    const isTablet = /tablet|ipad/i.test(user_agent || "");
    const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

    // Get detailed browser and OS info
    const { browser: browserName, version: browserVersion } = getBrowserInfo(
      user_agent || ""
    );
    const { os: osName, version: osVersion } = getOSInfo(user_agent || "");

    const browser = `${browserName} ${browserVersion}`.trim();
    const os = `${osName} ${osVersion}`.trim();

    console.log("Browser info:", { browser, os, deviceType });

    // If it's a bot, record the detection
    if (isBot) {
      console.log("Bot detected, recording detection");
      await supabase.from("bot_detections").insert({
        website_id: website.id,
        ip_address: ip,
        user_agent: user_agent || "",
        detection_reason: "User agent pattern match",
        is_blocked: true,
      });

      return new Response(
        JSON.stringify({
          success: true,
          blocked: true,
          reason: "Bot detected",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert analytics event
    console.log("Inserting analytics event for website:", website.name);
    const { error: insertError } = await supabase
      .from("analytics_events")
      .insert({
        website_id: website.id,
        event_type: event_type || "page_view",
        visitor_id: visitor_id || "anonymous",
        session_id: session_id || "session_" + Date.now(),
        page_url: page_url || "",
        referrer: referrer || "",
        user_agent: user_agent || "",
        ip_address: ip,
        country,
        city,
        device_type: deviceType,
        browser,
        os,
        is_bot: false,
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to insert event" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Event inserted successfully");
    return new Response(
      JSON.stringify({
        success: true,
        blocked: false,
        device_type: deviceType,
        browser,
        os,
        country,
        city,
        ip_address: ip,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in track-event function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
