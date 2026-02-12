import Layout from "../Layout/Layout"

function Result({ theme, setTheme }) {
  return (
    <Layout theme={theme} setTheme={setTheme}>
      <h2>Result</h2>
      <p>Your results will appear here.</p>
    </Layout>
  )
}

export default Result
