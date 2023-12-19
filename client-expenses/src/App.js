import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./components/Layout"
import Public from './components/Public'
import RequireAuth from './features/auth/RequireAuth'
import UserProfile from './features/users/UserProfile';
import UsersList from './features/users/UsersList';
import TopNavigation from './components/TopNavigation';
import UserExpenses from './features/expenses/UserExpenses';
import LeftNavigation from './components/LeftNavigation';
import UserOverview from './features/users/UserOverview';
import UserSettings from './features/users/UserSettings'

import './App.css'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';
import MonthlyExpenses from './features/expenses/MonthlyExpenses';

function App() {
  const user = useSelector(selectCurrentUser)

  if(user){
  return (
    <div className='app-container'>
      <div className='app-left-nav'>
        <LeftNavigation/>
      </div>
      <div className='app-content'>
        <div className='app-top-nav'>
          <TopNavigation/>
        </div>
        <div className='app-main-content'>
          <Routes>

            {/* protected routes */}
            <Route element={<RequireAuth />}>
              <Route path=":username/overview" element={<UserOverview/>} />
              <Route path=":username/expenses" element={<UserExpenses/>} />
              <Route path=":username/profile/" element={<UserProfile />} />
              <Route path=":username/monthly/" element={<MonthlyExpenses />} />
              <Route path=":username/settings" element={<UserSettings />} />
              <Route path="userslist" element={<UsersList />} />
              <Route path="*" element={<Navigate to={`/${user}/overview`} replace />} />
          </Route>
        </Routes>
        </div>
          
      </div>
    </div>
  );
  }

  return (
    <div className='app-public-container'>
      <div className='app-public-content'>
          <Routes>
            <Route path="/*" element={<Layout />}>
              {/* public routes */}
              <Route index element={<Public/>} />  
              <Route path="*" element={<Navigate to={`/`} replace />} />
            </Route>
        </Routes>
      </div>
    </div>
  )
}

export default App;
