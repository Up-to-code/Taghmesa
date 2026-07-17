export function CheckoutArt({ variant = "checkout" }: { variant?: "checkout" | "success" }) {
  const success = variant === "success";

  return <svg className={`checkout-art checkout-art-${variant}`} viewBox="0 0 420 320" role="img" aria-label={success ? "طلب تغميسة جاهز للتحضير" : "طلب تغميسة في حقيبة التوصيل"}>
    <path className="checkout-art-orbit" d="M37 178C27 91 96 27 190 29c103 2 193 74 191 162-2 82-79 117-180 111C105 296 47 260 37 178Z"/>
    <path className="checkout-art-trail" d="M23 93c42-21 68 17 104-4 35-20 59 9 92-3 34-13 54-39 96-30"/>
    <circle className="checkout-art-dot" cx="22" cy="93" r="4"/><circle className="checkout-art-dot" cx="315" cy="56" r="4"/>
    <g className="checkout-art-bag">
      <path d="M113 104h194l22 157H91l22-157Z"/>
      <path d="M154 111c0-37 20-63 56-63s56 26 56 63"/>
      <path d="M169 111c0-27 14-45 41-45s41 18 41 45"/>
      <path className="checkout-art-fold" d="m91 261 26-25h186l26 25M113 104l25 27h145l24-27"/>
    </g>
    <g className="checkout-art-bowl">
      <path d="M142 159c7 55 32 81 68 81s61-26 68-81c-18 13-41 19-68 19s-50-6-68-19Z"/>
      <path d="M151 154c19-19 99-19 118 0M174 205c22 8 48 8 70 0"/>
      <path className="checkout-art-leaf" d="M193 155c-9-25 1-42 29-50 5 25-6 43-29 50ZM193 155c-13-15-29-19-47-11 6 18 23 24 47 11Z"/>
    </g>
    {success && <g className="checkout-art-check"><circle cx="310" cy="102" r="38"/><path d="m291 102 13 13 25-28"/></g>}
    {!success && <g className="checkout-art-spark"><path d="M337 133v20M327 143h20M75 169v16M67 177h16"/></g>}
  </svg>;
}
