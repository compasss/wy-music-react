import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import {SearchPage} from "./pages/search/search";
import LoginPage from "./pages/login/login";
import {E404Page} from "./pages/error/e404";

// import logo from './logo.svg';
// import { Counter } from './features/counter/Counter';
import './App.css';


export default class App extends Component{
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Router basename={process.env.REACT_APP_PREFIX}>
          <Switch>
            <Route path="/search" exact component={SearchPage} />
            <Route path="/login" exact component={LoginPage} />
            <Route path="*" component={E404Page}></Route>
          </Switch>
        </Router>
      </ConfigProvider>

    )
  }
}

// function App() {
//   return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <Counter />
//           <p>
//             Edit <code>src/App.tsx</code> and save to reload.
//           </p>
//           <span>
//           <span>Learn </span>
//           <a
//               className="App-link"
//               href="https://reactjs.org/"
//               target="_blank"
//               rel="noopener noreferrer"
//           >
//             React
//           </a>
//           <span>, </span>
//           <a
//               className="App-link"
//               href="https://redux.js.org/"
//               target="_blank"
//               rel="noopener noreferrer"
//           >
//             Redux
//           </a>
//           <span>, </span>
//           <a
//               className="App-link"
//               href="https://redux-toolkit.js.org/"
//               target="_blank"
//               rel="noopener noreferrer"
//           >
//             Redux Toolkit
//           </a>
//           ,<span> and </span>
//           <a
//               className="App-link"
//               href="https://react-redux.js.org/"
//               target="_blank"
//               rel="noopener noreferrer"
//           >
//             React Redux
//           </a>
//         </span>
//         </header>
//       </div>
//   );
// }
//
// export default App;