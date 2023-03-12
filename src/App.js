import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/navbar";
import Spaceship from "./components/main";
import MainMobile from "./components/mainMobile";
import Collection from "./components/myCollection";
import InfoCentre from "./components/infoCentre";
import {
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/*<Route index element={<Spaceship />} />*/}
          {isMobile
            ? <Route index element={<MainMobile />} />
            : <Route index element={<Spaceship />} />
          }
          <Route path="gallery" element={<Collection />} />
          <Route path="mainMobile" element={<MainMobile />} />
          <Route path="infoCentre" element={<InfoCentre/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
