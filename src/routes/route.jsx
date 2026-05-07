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
                element: <HomePage />,
                handle: {
                    title: "Home",
                },
            },
            {
                path: '/users',
                element: <UserPage />,
                handle: {
                    title: "Usuários",
                },
            },
            {
                path: '/products',
                element: <ProductListPage />,
                handle: {
                    title: "Produtos",
                },
            }
        ]
    }
])

export default routes;