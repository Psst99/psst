import SectionNavigation from '@/components/SectionNavigation'
import CmsContent from '@/components/CmsContent'
import {homepageQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'

function HomepageLogoFallback({className}: {className?: string}) {
  return (
    <svg
      width="1614"
      height="572"
      viewBox="0 0 1614 572"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1165.7 9.7V82.2C1156.3 66.3 1143.8 52.3 1128.4 40.6C1093.5 14 1045.5 0 989.4 0C923.4 0 871.4 16.9 834.7 50.3C817.5 65.9 803.7 85.2 793.4 108C783.1 85.3 769.3 66 752.1 50.3C715.4 16.9 663.4 0 597.4 0C541.3 0 493.3 14 458.5 40.6C440.1 54.6 425.8 71.8 416 91.6C411.1 101.5 407.4 112 404.9 123C398.2 102.5 387.8 83.8 373.8 67.4C342 29.7 293.9 9.7 234.6 9.7H0V561.7H117.7V353.3H225.6C285.8 353.3 332.9 337.7 365.4 306.9C381.7 291.5 394 272.5 402.1 250.4C406 239.7 408.9 228.3 410.9 216.1C420.6 241.3 437.5 262.2 461.4 278.6C493.4 300.6 534 312.7 585.2 324H585.3C626.6 333 662.6 341.6 685.2 354.5C704.7 365.7 712.3 378.6 712.3 400.5C712.3 421.5 705.1 437 690.2 448.1C674.4 459.8 650.8 466 621.8 466C542.8 466 502.7 433.3 495.7 363.1L493.2 338.2H377.9L379.5 367.3C382.8 426.6 405.1 476.8 444.1 512.6C464.8 531.6 489.9 546.2 518.8 556.1C548.4 566.2 582.1 571.3 619 571.3C678.8 571.3 730.1 556.3 767.2 527.9C777.1 520.3 785.8 512 793.4 502.9C801 512 809.7 520.4 819.6 527.9C856.8 556.3 908 571.3 967.8 571.3C1004.7 571.3 1038.4 566.2 1068 556.1C1096.9 546.2 1122 531.6 1142.7 512.6C1181.6 476.9 1204 426.6 1207.3 367.3L1208.9 338.2H1093.6L1091.1 363.1C1084.1 433.3 1044.1 466 965 466C936 466 912.4 459.8 896.6 448.1C881.7 437 874.5 421.5 874.5 400.5C874.5 378.6 882.1 365.6 901.6 354.5C924.2 341.6 960.2 333 1001.5 324H1001.6C1052.7 312.6 1093.3 300.6 1125.4 278.6C1165.5 251 1185.8 210.8 1185.8 158.8C1185.8 145.2 1184.2 132.1 1181.1 119.7H1331V561.6H1448.7V119.8H1614V9.7H1165.7ZM117.7 119.1H224.2C248.6 119.1 267.8 124.7 279.5 135.2C290.8 145.3 296.6 161.3 296.6 182.5C296.6 210.3 288.7 247.3 220.7 247.3H117.7V119.1ZM817.3 210.1H884.5L887.6 186C891.1 158.4 901.2 137.6 917.6 124.2C934.2 110.7 957.8 103.8 988 103.8C1016 103.8 1038.6 109.2 1053.5 119.5C1066.1 128.3 1072.3 140.2 1072.3 156C1072.3 174.6 1063.1 183.6 1049.3 191.3C1028.8 202.8 996.5 210.2 964.7 216.4H964.6C915.8 226.2 864.9 237.9 826.3 263.2C813.6 271.5 802.7 281 793.5 291.6C784.3 281 773.3 271.4 760.7 263.2C722.1 238 671.2 226.3 622.4 216.4H622.3C590.4 210.1 558.1 202.8 537.7 191.3C523.9 183.5 514.7 174.6 514.7 156C514.7 140.2 520.8 128.2 533.5 119.5C548.4 109.2 571 103.8 599 103.8C629.2 103.8 652.9 110.6 669.4 124.2C685.8 137.6 695.9 158.4 699.4 186L702.5 210.1H769.7H817.3Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default async function Page() {
  const {data: homepage} = await sanityFetch({query: homepageQuery})

  return (
    <>
      <main className="h-[100svh] overflow-hidden">
        <div className="fixed inset-0 flex items-center justify-center">
          <div
            className="relative aspect-square max-h-full max-w-full"
            style={{width: 'min(100vw, 100svh)'}}
          >
            <HomepageLogoFallback className="absolute left-1/2 top-1/2 w-[87.5%] -translate-x-1/2 -translate-y-1/2 text-black" />
            <video
              src="/assets/hp-video-2.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-fill"
            />
          </div>
        </div>
      </main>

      {/* Fixed navigation at the bottom - only visible on desktop */}
      <div className="hidden min-[69.375rem]:block" data-view-transition="main-nav">
        <div className="fixed bottom-0 left-0 right-0 z-50 section-nav-fixed home-nav-fixed">
          <SectionNavigation currentSection="home" />
        </div>
      </div>
    </>
  )
}
