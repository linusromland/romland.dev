//External dependencies import
import { Field, ErrorMessage, Form, Formik } from 'formik';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

//Local dependencies import
import axios from '../axios';
import { successNotify, errorNotify } from '../components/Toast';

export default () => {
    const navigate = useNavigate();
    const { languageID } = useParams();

    const [language, setLanguage] = useState({});

    useEffect(() => {
        getLanguage();
    }, []);

    async function getLanguage() {
        const request = await axios.get(`/api/programmingLanguage/`, { params: { ids: languageID } });
        const response = await request.data;
        if (response.success) {
            if (response.data.length <= 0) navigate('/admin/language');

            setLanguage(response.data[0]);
        } else {
            errorNotify(response.error);
        }
    }

    return (
        <div className="flex w-full justify-center">
            <div className="mt-6 w-full rounded-md bg-slate-200 p-8 md:w-1/2">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-4xl font-semibold">Edit a project</h1>
                    <Link
                        to="/admin/language"
                        className="ease rounded-md border border-slate-500 bg-slate-300 p-2 text-black transition duration-150 hover:bg-slate-200"
                    >
                        Back to admin
                    </Link>
                </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        programmingLanguageName: language.programmingLanguageName || '',
                        programmingLanguageDescription: language.programmingLanguageDescription || '',
                        programmingLanguageIcon: language.programmingLanguageIcon || '',
                        programmingLanguageURL: language.programmingLanguageURL || '',
                        created: '',
                    }}
                    onSubmit={async (values, { setErrors }) => {
                        const request = await axios.put('/api/programmingLanguage/', {
                            programmingLanguageID: languageID,
                            ...values,
                        });
                        const response = await request.data;
                        if (response.success) {
                            successNotify('Language updated');
                        } else {
                            setErrors({
                                updated: response.error,
                            });
                            errorNotify('Error when updating language');
                        }
                    }}
                    validate={(values) => {
                        const errors = {};

                        if (values.programmingLanguageName.trim() === '') {
                            errors.programmingLanguageName = 'Language name cannot be empty';
                        }

                        if (values.programmingLanguageDescription.trim() === '') {
                            errors.programmingLanguageDescription = 'Language description cannot be empty';
                        }

                        if (values.programmingLanguageIcon.trim() === '') {
                            errors.programmingLanguageIcon = 'Language icon cannot be empty';
                        }

                        if (values.programmingLanguageURL.trim() === '') {
                            errors.programmingLanguageURL = 'Language URL cannot be empty';
                        }

                        const urlRegex = /((?:(?:http?)[s]*:\/\/)?[a-z0-9-%\\&=?.]+\.[a-z]{2,4}\/?([^\s<>#%",{}\\|\\^[\]`]+)?)/gi;

                        if (values.programmingLanguageIcon.trim() !== '') {
                            if (!new RegExp(urlRegex).test(values.programmingLanguageIcon)) {
                                errors.programmingLanguageIcon = 'Language icon is not a valid URL';
                            }
                        }

                        if (values.programmingLanguageURL.trim() !== '') {
                            if (!new RegExp(urlRegex).test(values.programmingLanguageURL)) {
                                errors.programmingLanguageURL = 'Language URL is not a valid URL';
                            }
                        }

                        return errors;
                    }}
                >
                    {({ isValid }) => (
                        <Form className="flex flex-col">
                            <label className="flex flex-col">
                                Programming language name
                                <Field
                                    name="programmingLanguageName"
                                    placeholder="Programming Language Name"
                                    autoComplete="off"
                                    className="rounded-md border border-gray-200 p-2"
                                    autoFocus
                                />
                            </label>
                            <ErrorMessage component="span" name="programmingLanguageName" className="mb-2 text-sm italic text-red-500" />
                            <label className="flex flex-col">
                                Programming language description
                                <Field
                                    name="programmingLanguageDescription"
                                    placeholder="Programming language description"
                                    autoComplete="off"
                                    as="textarea"
                                    className="rounded-md border border-gray-200 p-2"
                                />
                            </label>
                            <ErrorMessage
                                component="span"
                                name="programmingLanguageDescription"
                                className="mb-2 text-sm italic text-red-500"
                            />
                            <label className="flex flex-col">
                                <p>
                                    Programming language icon<span className="text-sm">(This should be a url to the image!)</span>
                                </p>
                                <Field
                                    name="programmingLanguageIcon"
                                    placeholder="Programming Language Icon"
                                    autoComplete="off"
                                    className="rounded-md border border-gray-200 p-2"
                                />
                            </label>
                            <ErrorMessage component="span" name="programmingLanguageIcon" className="mb-2 text-sm italic text-red-500" />
                            <label className="flex flex-col">
                                Programming language URL
                                <Field
                                    name="programmingLanguageURL"
                                    placeholder="Programming language URL"
                                    autoComplete="off"
                                    className="rounded-md border border-gray-200 p-2"
                                />
                            </label>
                            <ErrorMessage component="span" name="programmingLanguageURL" className="mb-2 text-sm italic text-red-500" />

                            <ErrorMessage component="span" name="created" className="mt-4 italic text-red-500" />
                            <input
                                disabled={!isValid}
                                className="ease mt-4 cursor-pointer rounded bg-blue-500 py-2 px-4 font-bold text-white transition duration-150 hover:bg-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-blue-300"
                                type="submit"
                                value="Create"
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
