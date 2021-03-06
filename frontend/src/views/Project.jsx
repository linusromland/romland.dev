//External dependencies import
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

//Local dependencies import
import LanguageTag from '../components/LanguageTag';
import { projectName } from '../contexts';

export default () => {
    const { projectID } = useParams();
    const projName = useContext(projectName);

    const [project, setProject] = useState({});
    const [images, setImages] = useState([]);

    async function getProject() {
        const request = await fetch(`/api/project?ids=${projectID}`);
        const response = await request.json();
        setProject(response.data[0]);

        const formatedImages = response.data[0].projectImages.map((image) => {
            return {
                original: `/api/projectImage/${image.projectImagesID}`,
                thumbnail: `/api/projectImage/${image.projectImagesID}`,
            };
        });

        if (formatedImages.length > 0) setImages(formatedImages);
        else
            setImages([
                {
                    original: '/api/projectImage/noImage',
                    thumbnail: '/api/projectImage/noImage',
                },
            ]);
    }

    useEffect(() => {
        getProject();
        document.title = `Project - ${projName}`;
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-start bg-cyan-900 md:justify-center">
            <div className="m-0 flex w-full flex-col rounded-none bg-transparent py-4 px-6 md:min-h-fit md:w-7/12 md:rounded-md md:bg-slate-400">
                <div className="h-1/4">
                    <ImageGallery
                        items={images}
                        showNav={false}
                        showFullscreenButton={false}
                        showPlayButton={false}
                        showThumbnails={project.projectImages && project.projectImages.length > 1 ? true : false}
                    />
                </div>
                <div className="ml-2 flex flex-col justify-end text-white md:text-black">
                    <h3 className="text-3xl font-semibold ">{project.projectName}</h3>
                    <p title={project.projectDescription}>{project.projectDescription}</p>
                    <div className="mt-2 flex justify-end">
                        {project.projectURL && (
                            <a
                                className="ease mr-4 rounded-md bg-slate-200 py-2 px-4 font-semibold text-black transition duration-150 hover:bg-slate-300"
                                href={project.projectURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Demo
                            </a>
                        )}
                        {project.projectSourceCodeURL && (
                            <a
                                className="ease rounded-md bg-slate-200 py-2 px-4 font-semibold text-black transition duration-150 hover:bg-slate-300"
                                href={project.projectSourceCodeURL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Source Code
                            </a>
                        )}
                    </div>
                    <div className="mt-2 flex">
                        {project.programmingLanguages &&
                            project.programmingLanguages.map((language) => (
                                <LanguageTag key={language.programmingLanguageID} languages={language} altColor={true} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
