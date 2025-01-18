// Dependencies
import { createRoutesFromElements, createBrowserRouter, Route } from 'react-router';
// CSS
import './App.css';
// Components

function App() {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route path="" element={<Layout />}>
        <Route path="" element={<Home />} />
        <Route path="account">
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<AccountLayout />}>
            <Route path="overview" element={<AccountOverview />} />
            <Route path="info" element={<AccountInfo />} />
          </Route>
        </Route>
        <Route path="users" element={<UsersLayout />}>
          <Route index element={<UsersList />} />
          <Route path=":id" element={<UpdateUser />} />
          <Route path=":id/update" element={<UpdateUser />} />
          <Route path="createuser" element={<CreateUser />} />
        </Route>
        <Route path="docs" element={<DocsLayout />}>
          <h1>Docs Subroutes here</h1>
        </Route>
      </Route>,
    ),
  );
}

export default App;
