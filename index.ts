import { serve } from "https://deno.land/std@0.130.0/http/server.ts";

const CLIENT_ID = Deno.env.get("CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET");

serve(async (req) => {

    let query = await req.text();

    let q = JSON.parse(query);
    let source = q.source;
    let target = q.target;
    let text = q.text;

    try {
        let resp =
        await fetch("https://openapi.naver.com/v1/papago/n2mt", {
            method: "POST",
            headers: {
                "X-Naver-Client-Id": CLIENT_ID,
                "X-Naver-Client-Secret": CLIENT_SECRET,
            },
            body: new URLSearchParams([["source", source], ["target", target], ["text", text]])
        });
        let respText = await resp.text();
        return new Response(
            `
            JP: ${JSON.parse(respText).message.result.translatedText}
            KR: ${text}
            `
        );
    } catch (ex) {
        console.log(ex);
    }
});
