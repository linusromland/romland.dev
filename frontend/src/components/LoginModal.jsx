//External dependencies import
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { Field, ErrorMessage, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';

//Local dependencies import
import axios from '../axios';
import { successNotify } from './Toast';

export default () => {
    const [modalIsOpen, setModal] = useState(true);

    useEffect(() => {
        (async function () {
            // You can await here
            const request = await axios.get('/api/auth');
            const data = await request.data;
            if (data.success) {
                setModal(false);
            }
        })();
    }, [modalIsOpen]);

    return (
        <>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModal(false)}
                shouldCloseOnOverlayClick={false}
                contentLabel="Login Modal"
                ariaHideApp={false}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        border: 'none',
                        background: '#fff',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
                    },
                }}
            >
                <div className="mb-4">
                    <Link to="/" className="mb-4 hover:underline ">
                        Go back
                    </Link>
                    <h1 className="text-3xl font-semibold">Access limited</h1>
                    <p className="text-xl"> Please login to access this page</p>
                </div>

                <Formik
                    initialValues={{ password: '', username: '', login: '' }}
                    onSubmit={(values, { setErrors }) => {
                        axios.post('/api/auth/login', values).then(({ data }) => {
                            if (data.success) {
                                setModal(false);
                                successNotify('Login successful');
                            } else {
                                setErrors({ login: data.error });
                            }
                        });
                    }}
                    validate={(values) => {
                        const errors = {};

                        if (values.username.trim() === '') {
                            errors.username = 'Username cannot be empty';
                        }

                        if (values.password.trim() === '') {
                            errors.password = 'Password cannot be empty';
                        }

                        return errors;
                    }}
                >
                    {({ dirty, isValid }) => (
                        <Form className="flex flex-col">
                            <label className="flex flex-col">
                                Username
                                <Field name="username" placeholder="Username" className="rounded-md border border-gray-200 p-2" autoFocus />
                            </label>
                            <ErrorMessage component="span" name="username" className="mb-4 italic text-red-500" />
                            <label className="flex flex-col">
                                Password
                                <Field
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="rounded-md border border-gray-200 p-2"
                                />
                            </label>
                            <ErrorMessage component="span" name="password" className="mb-4 italic text-red-500" />
                            <ErrorMessage component="span" name="login" className="mt-4 italic text-red-500" />
                            <input
                                disabled={!dirty || !isValid}
                                className="ease mt-4 cursor-pointer rounded bg-blue-500 py-2 px-4 font-bold text-white transition duration-150 hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300"
                                type="submit"
                                value="Login"
                            />
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    );
};
