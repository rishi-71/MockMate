import Layout from "../Layout/Layout"

function Dashboard({ theme, setTheme }) {
  return (
    <Layout theme={theme} setTheme={setTheme}>
      <h2>Dashboard</h2>
      <p>Welcome to MockMate 🚀</p>
    </Layout>
  )
}

export default Dashboard
