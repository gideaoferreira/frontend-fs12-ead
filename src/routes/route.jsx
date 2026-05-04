import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/app-layout.jsx";
import HomePage from "../pages/home/home-page.jsx";
import ProductListPage from "../pages/products/list/product-list-page.jsx";
import UserPage from "../pages/user/user-page.jsx";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: '/users',
                element: <UserPage />
            },
            {
                path: '/products',
                element: <ProductListPage />
            }
        ]
    }
])

export default routes;