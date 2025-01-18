// Dependencies
import { createRoutesFromElements, createBrowserRouter, Route, RouterProvider } from 'react-router';
// CSS
import './App.css';
// Components
import Layout from './components/Layout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<h2>MAIN CONTENT HERE</h2>} />
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

// <Route path="" element={<Home />} />
// <Route path="account">
//   <Route path="login" element={<Login />} />
//   <Route path="signup" element={<Signup />} />
//   <Route path="profile" element={<AccountLayout />}>
//     <Route path="overview" element={<AccountOverview />} />
//     <Route path="info" element={<AccountInfo />} />
//   </Route>
// </Route>
// <Route path="users" element={<UsersLayout />}>
//   <Route index element={<UsersList />} />
//   <Route path=":id" element={<UpdateUser />} />
//   <Route path=":id/update" element={<UpdateUser />} />
//   <Route path="createuser" element={<CreateUser />} />
// </Route>
// <Route path="docs" element={<DocsLayout />}>
//   <h1>Docs Subroutes here</h1>
// </Route>
