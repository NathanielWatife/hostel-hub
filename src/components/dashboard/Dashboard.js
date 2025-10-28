// Small compatibility wrapper: re-export the JSX component so builds
// that don't resolve .jsx file extensions (or expect .js) still work.
import Dashboard from './Dashboard.jsx';
export default Dashboard;
