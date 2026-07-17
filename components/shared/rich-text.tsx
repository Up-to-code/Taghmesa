import sanitizeHtml from "sanitize-html";
import { cn } from "@/lib/utils";

const allowedTags=["p","br","strong","em","s","h2","h3","ul","ol","li","blockquote","hr"];
export function RichText({html,className}:{html:string;className?:string}){const content=/<\/?[a-z][\s\S]*>/i.test(html)?html:`<p>${html.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\n","<br>")}</p>`;const safe=sanitizeHtml(content,{allowedTags,allowedAttributes:{}});return <div className={cn("rich-text-content",className)} dangerouslySetInnerHTML={{__html:safe}}/>}
