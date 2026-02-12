import Navbar from "./Navbar"

function Layout({ children, theme, setTheme }) {
  return (
    <>
      <Navbar theme={theme} setTheme={setTheme} />
      <div style={{ padding: "40px" }}>
        {children}
      </div>
    </>
  )
}

export default Layout
