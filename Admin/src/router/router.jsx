import { createBrowserRouter, createRoutesFromElements, Route, Router } from "react-router-dom"
import App from "../App"
import DashBoard from "../pages/DashBoard"
import ListShows from "../pages/ListShows"
import AddShows from "../pages/AddShows"
import ListBookings from "../pages/ListBookings"

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/*" element={<App />}>
                <Route path="admin" element={<DashBoard />} />
                <Route path="admin/list-shows" element={<ListShows />} />
                <Route path="admin/add-shows" element={<AddShows />} />
                <Route path="admin/list-bookings" element={<ListBookings />} />
            </Route>
        </>
    )
) 

export default router