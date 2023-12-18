import './globals.css'
import { DefaultSidebar, NavbarSimple } from '@/components/Navigation'

export const metadata = {
  title: 'Robodolph',
  description: 'Holiday Themed AI jobs search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  //const thisAppName = "Sebenzo South Africa"
  const thisLogoUrl = "https://muaazbayat.github.io/ai_expo_demo/ROBODOLPH.png"
  return (
    <html lang="en">
      <body className="bg-background text-foreground h-screen">
        {/* Error message for mobile and tablet */}
        <div className="md:hidden flex items-center justify-center h-screen">
          <div className="text-center p-4 bg-red-600 text-white rounded-lg ml-4 mr-4">
            <p>Please move to a bigger screen to use this application.</p>
          </div>
        </div>

        {/* Content for larger screens */}
        <div className="hidden md:block">
          {/* Mobile navbar */}
          <div className="md:hidden">
            <NavbarSimple />
          </div>
          <main className="h-screen flex">
            {/* Sidebar for larger screens */}
            <div className="h-screen hidden md:block">
              <DefaultSidebar logoUrl={thisLogoUrl} />
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-100">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
