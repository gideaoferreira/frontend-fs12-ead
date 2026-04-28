import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/app-layout.jsx";
import HomePage from "../pages/home/home-page.jsx";
import ProductListPage from "../pages/products/list/product-list-page.jsx";

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
                path: '/products',
                element: <ProductListPage />
            }
        ]
    }
])

export default routes;