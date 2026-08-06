"use client"

import Script from 'next/script'

export default function Analytics() {
  return (
    <>
      {/* Google Analytics with Next.js Script optimization */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Q2Q8VG9V8G"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Q2Q8VG9V8G');
        `}
      </Script>

      {/* Microsoft Clarity with Next.js Script optimization */}
      <Script id="microsoft-clarity" strategy="lazyOnload">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "tb5i4qa713");
        `}
      </Script>
    </>
  )
}