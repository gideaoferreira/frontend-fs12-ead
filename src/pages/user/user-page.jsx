import axios from "axios";
import { Modal, Offcanvas } from "bootstrap";
import { useEffect, useRef, useState } from "react";

function UserPage() {
  const [listUsers, setListUsers] = useState([]);
  const [userDelete, setUserDelete] = useState({});

  const deleteUserModalRef = useRef();
  const createUserOffcanvasRef = useRef();

  function initDeleteUserModal() {
    const modalElement = document.getElementById("delete-user-modal");
    const modal = new Modal(modalElement);
    deleteUserModalRef.current = modal;
  }

  function toggleDeleteUserModal() {
    deleteUserModalRef.current.toggle();
  }

  function initCreateUserOffcanvas() {
    const offcanvasElement = document.getElementById("createUserOffcanvas");
    const offcanvas = new Offcanvas(offcanvasElement, { backdrop: true });
    createUserOffcanvasRef.current = offcanvas;
  }

  function toggleCreateUserOffcanvas() {
    deleteUserModalRef.current.toggle();
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

  function getUsers() {
    axios
      .get("http://localhost:3000/users")
      .then((response) => {
        setListUsers(response.data);
      })
      .catch((error) => {
        console.warn(error);
      });
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
    initDeleteUserModal();
    initCreateUserOffcanvas();
    getUsers();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-success btn-sm"
          onClick={toggleCreateUserOffcanvas}
        >
          Cadastrar
        </button>
      </div>
      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Sobrenome</th>
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
              <td>{user.birthDate}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUserModal(user)}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="delete-user-modal"
        tabIndex="-1"
        aria-labelledby="delete-user-modal-label"
        aria-hidden="true"
      >
        <div className="modal-dialog">
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
