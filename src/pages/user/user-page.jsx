import axios from "axios";
import { Trash, PencilSquare, PlusLg, ThreeDotsVertical, Search } from "react-bootstrap-icons"
import { useSearchParams } from "react-router-dom"
import { Modal, Offcanvas } from "bootstrap";
import { useEffect, useRef, useState } from "react";

function UserPage() {
  const [listUsers, setListUsers] = useState([]);
  const [userDelete, setUserDelete] = useState({});
  const [userUpdate, setUserUpdate] = useState({});
  const [pageNumberController, setPageNumberController] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState({});
  const [currentPage, setCurentPage] = useState({});

  const deleteUserModalRef = useRef();
  const updateUserOffcanvasRef = useRef()
  const createUserOffcanvasRef = useRef();

  function dateToPtBr(data) {
    return data.split('-').reverse().join('/')
  }

  function initDeleteUserModal() {
    const modalElement = document.getElementById("delete-user-modal");
    const modal = new Modal(modalElement);
    deleteUserModalRef.current = modal;
  }

  function toggleDeleteUserModal() {
    deleteUserModalRef.current.toggle();
  }

  function initUpdateUserOffcanvas() {
    const offcanvasElement = document.getElementById("updateUserOffcanvas")
    const offcanvas = new Offcanvas(offcanvasElement, { backdrop: true })
    updateUserOffcanvasRef.current = offcanvas
  }

  function initCreateUserOffcanvas() {
    const offcanvasElement = document.getElementById("createUserOffcanvas");
    const offcanvas = new Offcanvas(offcanvasElement, { backdrop: true });
    createUserOffcanvasRef.current = offcanvas;
  }

  function toggleUpdateUserOffcanvas() {
    updateUserOffcanvasRef.current.toggle();
  }

  function toggleCreateUserOffcanvas() {
    createUserOffcanvasRef.current.toggle();
  }

  function updateUserOffcanvas(user) {
    setUserUpdate(user)
    toggleUpdateUserOffcanvas()
  }

  function deleteUserModal(user) {
    setUserDelete(user);
    toggleDeleteUserModal();
  }

  function deleteUser() {
    axios.delete(`http://localhost:3000/user/${userDelete.id}`)
      .then((response) => {
        console.log(response)
        toggleDeleteUserModal();
        getUsers();
      })
      .catch((error) => {
        console.log(error.response)
      })
  }

  function sortBy(sortBy, sort) {
    setSearchParams((searchParams) => {
      searchParams.set("sortBy", sortBy);
      searchParams.set("sort", sort);
      return searchParams;
    });

    getUsers()
  }

  function search() {
    const searchForm = document.getElementById('search-form')
    const formData = new FormData(searchForm)
    const data = Object.fromEntries(formData)

    setSearchParams((searchParams) => {
      data.search ? searchParams.set("filter", data.search) : searchParams.delete("filter");
      return searchParams;
    });


    getUsers()
  }

  function getUsers() {
    const params = Array.from(searchParams.entries()).join("&").replaceAll(',', '=')
    let baseUrl = `http://localhost:3000/users?${params}`

    console.log(baseUrl)

    axios
      .get(baseUrl)
      .then((response) => {
        console.log(response.data)
        setListUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages)
        setCurentPage(response.data.pagination.currentPage)
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  function paginate(page) {
    const filter = searchParams.get('filter') ?? ''

    if (filter !== '') {
      getUsers(page, 10, filter)
    }

    if (filter === '' || !filter) {
      getUsers(page, 10)
    }

    if (page === 1) {
      setPageNumberController(1)
    }

    if (page >= totalPages) {
      setPageNumberController(totalPages)
      return
    }
    
    if (page > currentPage) {
      setPageNumberController(pageNumberController + 1)
    }

    if (page >= 2 && page < currentPage) {
      setPageNumberController(page-1)
    }
  }

  function next() {
    const pageParse = Number(searchParams.get('page'))
    const totalPagesParse = Number(totalPages)
    
    if (pageParse >= totalPagesParse) {
      return
    }

    getUsers(pageParse + 1)
    
    if (pageParse + 1 > currentPage) {
      setPageNumberController(pageNumberController + 1)
    }

    if (pageParse + 1 >= 2 && pageParse + 1 < currentPage) {
      setPageNumberController(pageNumberController-1)
    }
  }

  function previous() {
    const pageParse = Number(searchParams.get('page'))
    const fistPage = 1
   
    if (pageParse <= fistPage) {
      console.log(pageParse <= fistPage, pageParse, fistPage)
      return
    }

    getUsers(pageParse - 1)
    
    if (pageParse - 1 > currentPage) {
      setPageNumberController(pageNumberController + 1)
    }

    if (pageParse - 1 >= 2 && pageNumberController > 1) {
      setPageNumberController(pageNumberController-1)
    }
  }

  function updateUser() {
    const formUpdateUser = document.getElementById("form-update-user");
    const formData = new FormData(formUpdateUser);
    const data = Object.fromEntries(formData)
    
    axios.put(`http://localhost:3000/user/${userUpdate.id}`, data)
      .then((response) => {
        console.log(response.data)
        toggleUpdateUserOffcanvas()
        getUsers();
      })
  }

  function createUser() {
    const formCreateUser = document.getElementById("form-create-user");
    const formData = new FormData(formCreateUser);
    const data = Object.fromEntries(formData);

    axios
      .post("http://localhost:3000/user", data)
      .then((response) => {
        if (response.status !== 201) {
          console.log(response);
          return;
        }

        formCreateUser.reset();
        toggleCreateUserOffcanvas();
        getUsers();
      })
      .catch((error) => {
        console.warn("catch", error.response);
      });
  }

  useEffect(() => {
    const page = searchParams.get('page') ?? 1

    initDeleteUserModal();
    initCreateUserOffcanvas();
    initUpdateUserOffcanvas();
    getUsers();
    paginate(page)

  }, [searchParams]);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <div className="input-group">
            <form id="search-form" className="d-flex gap-1">
              <input type="text" name="search" className="form-control form-control-sm" placeholder="Pesquise por id, nome ou email" aria-label="Recipient’s username" aria-describedby="button-addon2" />
              <button className="btn btn-secondary btn-sm" type="button" id="button-addon2" onClick={search}>
                <Search />
              </button>
            </form>
          </div>
          <div className="dropdown">
            <button className="btn btn-secondary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <ThreeDotsVertical />
            </button>
            <ul className="dropdown-menu">
              <li><button type="button" className="dropdown-item" onClick={() => sortBy('id','ASC')}>Id crescente</button></li>
              <li><button type="button" className="dropdown-item" onClick={() => sortBy('id','DESC')}>Id decrescente</button></li>
              <li><button type="button" className="dropdown-item" onClick={() => sortBy('name','ASC')}>Nome crescente</button></li>
              <li><button type="button" className="dropdown-item" onClick={() => sortBy('name','DESC')}>Nome decrescente</button></li>
            </ul>
          </div>
        </div>
        <button
          className="btn btn-success btn-sm"
          onClick={toggleCreateUserOffcanvas}
        >
          <PlusLg />
        </button>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nome</th>
                <th>Sobrenome</th>
                <th>Gênero</th>
                <th>Nascimento</th>
                <th>Email</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listUsers.map((user, index) => (
                <tr key={index}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.lastName}</td>
                  <td>{user.gender}</td>
                  <td>
                    {dateToPtBr(user.birthDate)}
                  </td>
                  <td>{user.email}</td>
                  <td style={{ width: '85px' }}>
                    { user.status === 'block' && <span className="badge bg-danger" style={{ width:'80px' }}>Danger</span> }
                    { user.status === 'inactive' && <span className="badge bg-warning text-dark" style={{ width:'80px' }}>Desativado</span> }
                    { user.status === 'active' && <span className="badge bg-success" style={{ width:'80px' }}>Ativado</span> }
                  </td>
                  <td>
                    <div className="w-100 d-flex justify-content-end">
                      <button
                        className="btn text-secondary py-0"
                        onClick={() => updateUserOffcanvas(user)}
                      >
                        <PencilSquare />
                      </button>
                      <button
                        className="btn text-secondary py-0"
                        onClick={() => deleteUserModal(user)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="d-flex justify-content-center" aria-label="Page navigation example">
            <ul className="pagination pagination-sm">
              <li className="page-item"><button className="btn btn-light btn-sm" onClick={() => paginate(1)}>Primeira</button></li>
              <li className="page-item"><button className="btn btn-light btn-sm" onClick={previous}>Anterior</button></li>
              {Array.from({ length: 10 }, (v, i) => i + pageNumberController).map((item) => (
                item <= totalPages ?
                  <li className="page-item" key={item}>
                    <button className={ item === currentPage ? 'btn btn-primary btn-sm' : 'btn btn-light btn-sm' } onClick={() => paginate(item)}>{ item } </button>
                  </li>
                  : ''
              ))}
              <li className="page-item"><button className="btn btn-light btn-sm" onClick={next}>Próximo</button></li>
              <li className="page-item"><button className="btn btn-light btn-sm" onClick={() => paginate(totalPages)}>Ultima</button></li>
            </ul>
          </nav>
        </div>
      </div>

      <div
        className="modal fade"
        id="delete-user-modal"
        tabIndex="-1"
        aria-labelledby="delete-user-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="delete-user-modal-label">
                Deletar usuário
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-center">
                Você está prestes a deletar o usuário:{" "}
              </p>
              <h4 className="text-center"> {userDelete.name} </h4>
              <div className="alert alert-warning text-center">
                <small>
                  Esta operação não poderá ser desfeita posteriormente
                </small>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={toggleDeleteUserModal}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={deleteUser}>
                Deletar
              </button>
            </div>
          </div>
        </div>
      </div>
        
      {/* Modal lateral para atualizar o usuário */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="updateUserOffcanvas"
        aria-labelledby="updateUserLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="updateUserLabel">
            Atualização de usuário
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form className="form" id="form-update-user">
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">
                Nome
              </label>
              <input
                type="text"
                className="form-control"
                id="userName"
                name="name"
                defaultValue={userUpdate.name}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Sobrenome
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                defaultValue={userUpdate.lastName}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                defaultValue={userUpdate.email}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">
                Data de nascimento
              </label>
              <input
                type="date"
                className="form-control"
                id="birthDate"
                name="birthDate"
                defaultValue={userUpdate.birthDate}
              />
            </div>
            <div className="row mb-3">
              <div className="col">
                <label htmlFor="gender" className="form-label">
                  Genero
                </label>
                <select className="form-select" name="gender" id="gender">
                  <option value="Masculino" selected={ userUpdate.gender == 'Masculino' ? true : false }>Masculino</option>
                  <option value="Feminino" selected={ userUpdate.gender == 'Feminino' ? true : false }>Feminino</option>
                  <option value="Outros" selected={ userUpdate.gender == 'Outros' ? true : false }>Outros</option>
                  <option value="Prefiro não informar"  selected={ userUpdate.gender == 'Prefiro não informar' ? true : false }>Prefiro não informa</option>
                </select>
              </div>
              <div className="col">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select className="form-select" name="status" id="status">
                  <option value="active" selected={ userUpdate.status == 'active' ? true : false }>Ativo</option>
                  <option value="inactive" selected={ userUpdate.status == 'inactive' ? true : false }>Desativado</option>
                  <option value="block" selected={ userUpdate.status == 'block' ? true : false }>Bloqueado</option>
                </select>
              </div>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={toggleUpdateUserOffcanvas}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={updateUser}
              >
                Atualizar
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="createUserOffcanvas"
        aria-labelledby="createUserLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="createUserLabel">
            Cadastro de usuários
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <form className="form" id="form-create-user">
            <div className="mb-3">
              <label htmlFor="userName" className="form-label">
                Nome
              </label>
              <input
                type="text"
                className="form-control"
                id="userName"
                name="name"
                placeholder="Maria do Carmo..."
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Sobrenome
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                placeholder="Santos e Silva..."
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                placeholder="maridc@gmail.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="birthDate" className="form-label">
                Data de nascimento
              </label>
              <input
                type="date"
                className="form-control"
                id="birthDate"
                name="birthDate"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Genero
              </label>
              <select className="form-select" name="gender" id="gender">
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outros">Outros</option>
                <option value="Prefiro não informa">Prefiro não informa</option>
              </select>
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={toggleCreateUserOffcanvas}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={createUser}
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default UserPage;
