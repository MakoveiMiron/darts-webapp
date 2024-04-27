import { Outlet } from "react-router-dom";
import Nav from "../Nav/Nav";
export default function PublicLayout() {
  return(
  <>
    <Nav />
    <Outlet />;
  </>
  )
}
