import axios from "axios"
import { Offcanvas } from "bootstrap"
import { useEffect, useState } from "react"

function ProductListPage() {
    const [listProducts, setListProducts] = useState([])

    async function getProducts() {
        const products = await axios.get('http://localhost:3000/products')
        console.log(products.data)
        setListProducts(products.data)
    }

    function openCreateProductModal() {
        const offcanvasElement = document.getElementById('createProduct')
        const offcanvas = new Offcanvas(offcanvasElement, {
            backdrop: true
        })

        offcanvas.show()
    }

    useEffect(() => getProducts, [])
    
    
    return (
        <>
            <div className="d-flex justify-content-end">
                <button className="btn btn-sm btn-success" onClick={openCreateProductModal}>Cadastrar</button>
            </div>
            <table className="table table-sm table-striped">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Custo</th>
                        <th>Venda</th>
                        <th>Descrição</th>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {listProducts.map((product, index) => (
                    <tr key={index}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.costPrice}</td>
                            <td>{product.price}</td>
                            <td>{product.description.slice(0, 100)}...</td>
                            <td className="d-flex justify-content-end gap-1">
                                <button className="btn btn-sm btn-primary">Detalhes</button>
                                <button className="btn btn-sm btn-danger">Deletar</button>
                            </td>
                        </tr>
                    ))}
 
                </tbody>
            </table>

            <div
                className="offcanvas offcanvas-start"
                tabIndex="-1"
                id="createProduct"
                aria-labelledby="createProductLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="createProductLabel">Cadastro de produtos</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <form className="form">
                        <div className="mb-3">
                            <label for="productName" className="form-label">Nome</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                placeholder="Tênis nike..."
                            />
                        </div>
                        <div className="mb-3">
                            <label for="productName" className="form-label">Preço de custo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                placeholder="Tênis nike..."
                            />
                        </div>
                        <div className="mb-3">
                            <label for="productName" className="form-label">Preço de venda</label>
                            <input
                                type="text"
                                className="form-control"
                                id="productName"
                                placeholder="Tênis nike..."
                            />
                        </div>
                        <div className="mb-3">
                            <label for="productDescription" className="form-label">Descrição</label>
                            <textarea className="form-control" id="productDescription" rows="3"></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProductListPage