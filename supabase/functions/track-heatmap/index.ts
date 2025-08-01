import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Track heatmap function called with method:", req.method);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const requestData = await req.json();
    console.log("Heatmap request data:", requestData);

    const {
      tracking_code,
      event_type,
      page_url,
      x_position,
      y_position,
      element_selector,
      element_text,
      session_id,
      visitor_id,
    } = requestData;

    if (!tracking_code) {
      console.error("Missing tracking code");
      return new Response(JSON.stringify({ error: "Missing tracking code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate event type - match the database schema
    const validEventTypes = [
      "click",
      "scroll",
      "hover",
      "form_focus",
      "form_submit",
    ];
    if (!validEventTypes.includes(event_type)) {
      console.error("Invalid event type:", event_type);
      return new Response(JSON.stringify({ error: "Invalid event type" }), {
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

    // Check if heatmap is enabled
    if (!website.heatmap_enabled) {
      console.log("Heatmap is not enabled for this website");
      return new Response(
        JSON.stringify({ error: "Heatmap tracking is disabled" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert heatmap event - remove scroll_depth field
    console.log("Inserting heatmap event for website:", website.name);
    const { error: insertError } = await supabase
      .from("heatmap_events")
      .insert({
        website_id: website.id,
        session_id: session_id || "session_" + Date.now(),
        visitor_id: visitor_id || "anonymous",
        event_type: event_type,
        page_url: page_url || "",
        x_position: x_position ? Math.round(Number(x_position)) : null,
        y_position: y_position ? Math.round(Number(y_position)) : null,
        element_selector: element_selector || "",
        element_text: element_text || "",
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({
          error: "Failed to insert heatmap event",
          details: insertError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Heatmap event inserted successfully");
    return new Response(
      JSON.stringify({
        success: true,
        event_type: event_type,
        website_id: website.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in track-heatmap function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
