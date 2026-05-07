import AppContent from "./content/app-content"
import AppFooter from "./footer/app-footer"
import AppHeader from "./header/app-header"

function AppLayout() {
    return (
    <>
        <AppHeader />
        <div className="py-3" style={{ backgroundColor: '#e9ecef' }}>
          <AppContent />
        </div>
        <AppFooter />
    </>
  )
}

export default AppLayout
