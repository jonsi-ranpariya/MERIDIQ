import Button from '@components/form/Button';
import { Popover, Transition } from '@headlessui/react';
import { File as ModelFile } from '@interface/model/File';
import { Template } from '@interface/model/template';
import { useFormikContext } from 'formik';
import { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import api from '../../../../../configs/api';
import { commonFetch, generateCanvasImage, getSignedUrl, toBase64 } from '../../../../../helper';
import { useCursorPaginationSWR } from '../../../../../hooks/useCursorPaginationSWR';
import { TemplatesResponse } from '../../../../../interfaces/common';
import { MediaData } from '../../../../../interfaces/model/media_data';
import strings from '../../../../../lang/Lang';
import { useConfirmation } from '../../../../../provider/ConfirmationProvider';
import ClientMediaModal from '../../Media/ClientMediaModal';
import { IClientProcedureCreateValues } from './ClientProcedureCreate';

interface ClientProcedurePictureProps {

}

const ClientProcedurePicture = (props: ClientProcedurePictureProps) => {
    const { clientId }: { clientId?: string } = useParams();


    const { data: templateData } = useSWR<TemplatesResponse, Error>(api.template, commonFetch)
    const { data: mediaData, loadMore, hasMore, reload } = useCursorPaginationSWR<MediaData, Error>(
        api.clientMedia(clientId) ?? "",
        {
            limit: 3,
        }
    );
    const confirm = useConfirmation();

    const {
        values,
        setFieldValue,
    } = useFormikContext<IClientProcedureCreateValues>();

    const [openMediaModal, setOpenMediaModal] = useState(false);

    async function onImageSelect(files: (Blob | File)[]) {
        if (!files.length) return;

        let newImages = [...values.images];

        for (let index = 0; index < files?.length; index++) {
            let file = files[index];

            if ((newImages.length - 1) >= (values.selectedIndex + index)) {
                newImages = await Promise.all(newImages.map(async (newImage, newImageIndex) => {
                    if (newImageIndex === (values.selectedIndex + index)) {
                        const data = await toBase64(file as File);
                        return {
                            ...newImage,
                            id: uuidv4(),
                            image: data,
                            imageData: await generateCanvasImage(data),
                            canvasData: '',
                            updated: true,
                        };
                    }
                    return newImage;
                })) as {
                    id: string;
                    image: string;
                    imageData: string;
                    canvasData: string;
                }[];

            } else {
                const data = await toBase64(file as File);

                newImages = [
                    ...newImages,
                    {
                        id: uuidv4(),
                        image: data,
                        imageData: await generateCanvasImage(data),
                        canvasData: '',
                        updated: true,
                    }
                ]
            }
        }

        await setFieldValue('images', newImages);
        await setFieldValue('selectedIndex', values.selectedIndex + (files.length - 1));

    }

    async function onTemplateImageClick(template: Template) {
        if (values.images[values.selectedIndex].image) {
            try {
                await confirm({
                    showCancel: true,
                    showSubmit: true,
                    open: true,
                    title: strings.Confirm,
                    children: <p className="p-4">{strings.image_override_question}</p>
                })
            } catch (error) {
                return;
            }
        }

        const url = await getSignedUrl(template.image)

        setFieldValue(`images.${values.selectedIndex}`, {
            ...values.images[values.selectedIndex],
            id: uuidv4(),
            image: url, // &id=${uuidv4()}
            imageData: '',
            canvasData: '',
            updated: true,
        });
    }

    async function onMediaImageClick(file: ModelFile) {
        if (values.images[values.selectedIndex].image) {
            try {
                await confirm({
                    showCancel: true,
                    showSubmit: true,
                    open: true,
                    title: strings.Confirm,
                    children: <p className="p-4">{strings.image_override_question}</p>
                })
            } catch (error) {
                return;
            }
        }

        const url = await getSignedUrl(file.filename)

        setFieldValue(`images.${values.selectedIndex}`, {
            ...values.images[values.selectedIndex],
            id: uuidv4(),
            image: url, // &id=${uuidv4()}
            imageData: '',
            canvasData: '',
            updated: true,
        });
    }

    return (
        <div className="mb-4">
            {openMediaModal &&
                <ClientMediaModal
                    openModal={openMediaModal}
                    setOpenModal={setOpenMediaModal}
                    mutate={async () => reload()}
                    onImageSelect={(files) => onImageSelect(files as any)}
                />
            }
            <p className="text-primary-600 mb-2">{strings.Pictures}</p>
            <div className="grid grid-cols-3 grid-flow-row gap-4 relative">
                <Popover>
                    <Popover.Button className="w-full" as='div'>
                        <Button
                            size="small"
                            color={"primary"}
                            variant="ghost"
                            fullWidth
                        >{strings.USETEMPLATE}</Button>
                    </Popover.Button>
                    <Transition
                        key={"Template_Modal"}
                        className="absolute w-full bg-white dark:bg-dimGray z-50 shadow-card rounded-md mt-2"
                        enter="transition-all duration-300"
                        enterFrom="top-[90%] opacity-0"
                        enterTo="top-full opacity-100"
                        leave="transition-all ease-out duration-75"
                        leaveFrom="top-full opacity-100"
                        leaveTo="top-[90%] opacity-0"
                    >
                        <Popover.Panel className="grid grid-flow-row grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 p-4">
                            {
                                templateData?.data.length ?
                                    templateData?.data?.map((template) => (
                                        <Popover.Button
                                            as='img'
                                            key={template.id}
                                            className="rounded object-contain w-full h-28 bg-white border dark:bg-dimGray dark:border-gray-700"
                                            src={`${api.storage}${template.image}`}
                                            alt={template.name}
                                            loading="lazy"
                                            onClick={() => onTemplateImageClick(template)}
                                        />
                                    )) : strings.no_data}
                        </Popover.Panel>
                    </Transition>
                </Popover>
                <Popover>
                    <Popover.Button className="w-full" as='div'>
                        <Button
                            size="small"
                            variant="ghost"
                            color={"primary"}
                            fullWidth
                        >{strings.media}</Button>
                    </Popover.Button>

                    <Transition
                        key={"Media_Modal"}
                        className="absolute left-0 w-full bg-white dark:bg-dimGray z-50 shadow-card rounded-md mt-2 max-h-96 overflow-auto p-4 space-y-4"
                        enter="transition-all duration-300"
                        enterFrom="top-[90%] opacity-0"
                        enterTo="top-full opacity-100"
                        leave="transition-all ease-out duration-75"
                        leaveFrom="top-full opacity-100"
                        leaveTo="top-[90%] opacity-0"
                    >
                        <Popover.Panel className="grid grid-flow-row grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                            {mediaData?.length ?
                                mediaData?.map((media) => (
                                    media.data.map((file) => {
                                        return (
                                            <Popover.Button
                                                as='img'
                                                key={file.id}
                                                className="rounded object-cover bg-white border dark:bg-dimGray dark:border-gray-700 w-full h-28"
                                                src={api.storageUrl(file.thumbnail ?? file.filename)}
                                                alt={file.thumbnail ?? file.filename}
                                                loading="lazy"
                                                onClick={() => onMediaImageClick(file)}
                                            />
                                        );
                                    })
                                )) : strings.no_data}

                        </Popover.Panel>
                        {hasMore &&
                            <div className="mb-3 lg:mb-0">
                                <Button
                                    size="small"
                                    variant="filled"
                                    // color=""
                                    onClick={() => loadMore()}
                                >
                                    {strings.loadMore}
                                </Button>
                            </div>
                        }
                    </Transition>
                </Popover>
                <Button
                    size="small"
                    fullWidth
                    variant="ghost"
                    onClick={async () => {
                        if (values.images[values.selectedIndex].image) {
                            try {
                                await confirm({
                                    showCancel: true,
                                    showSubmit: true,
                                    open: true,
                                    title: strings.Confirm,
                                    children: <p className="p-4">{strings.image_override_question}</p>
                                })
                            } catch (error) {
                                return;
                            }
                        }

                        setOpenMediaModal(true);
                    }}
                >{strings.add_media}</Button>
            </div>
        </div >
    )
}

// OLD Code to add feature for camera
// const ClientProcedureCamera = () => {
//     const {
//         values,
//         setFieldValue,
//     } = useFormikContext<IClientProcedureCreateValues>();
//     const confirm = useConfirmation();
//     const [isCamaraOpen, setIsCamaraOpen] = useState(false);

//     return (
//         <>
//             <ShowCameraModel
//                 openModel={isCamaraOpen}
//                 handleClose={() => {
//                     setIsCamaraOpen(false);
//                 }}
//                 onTakePhoto={async (dataUri) => {
//                     if (values.images[values.selectedIndex].image) {
//                         try {
//                             await confirm({
//                                 open: true,
//                                 showCancel: true,
//                                 showSubmit: true,
//                                 title: strings.Confirm,
//                                 children: <p className="p-4">{strings.image_override_question}</p>
//                             })
//                         } catch (error) {
//                             return;
//                         }
//                     }

//                     await setFieldValue('images', values.images.map((imageData, index) => {
//                         if (values.selectedIndex === index) {
//                             return {
//                                 ...imageData,
//                                 id: uuidv4(),
//                                 image: dataUri,
//                                 imageData: '',
//                                 canvasData: '',
//                             }
//                         }
//                         return imageData;
//                     }));

//                 }}
//                 onTakePhotoAnimationDone={() => {
//                     setIsCamaraOpen(false);
//                 }}
//             />
//             <Button
//                 className="h-full"
//                 size="small"
//                 fullWidth
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => {
//                     setIsCamaraOpen(true);
//                 }}
//             >{strings.TAKEPHOTOS}</Button>
//         </>
//     );
// };

// const ClientProcedureAddFile = () => {
//     const fileRef = useRef<HTMLInputElement>(null);
//     const {
//         values,
//         setFieldValue,
//     } = useFormikContext<IClientProcedureCreateValues>();
//     const confirm = useConfirmation();

//     return (
//         <>
//             <input
//                 type="file"
//                 name="select-file-label"
//                 id="select-file-label"
//                 className="hidden"
//                 ref={fileRef}
//                 onChange={async (event) => {
//                     // event.stopPropagation();
//                     // event.preventDefault();
//                     if (!event?.target?.files?.length) return;
//                     let newImages = [...values.images];
//                     const files = event.target.files;

//                     if (newImages[values.selectedIndex].image) {
//                         try {
//                             await confirm({
//                                 showCancel: true,
//                                 showSubmit: true,
//                                 open: true,
//                                 title: strings.Confirm,
//                                 children: <p className="p-4">{strings.image_override_question}</p>
//                             })
//                         } catch (error) {
//                             return;
//                         }
//                     }
//                     for (let index = 0; index < files.length; index++) {
//                         const filename = files[index].name.split('.').pop();
//                         if (fileTypes.includes(filename ?? '')) continue;
//                         alert(strings.only_images_allowed);
//                         return;
//                     }

//                     for (let index = 0; index < files?.length; index++) {
//                         // update image object.
//                         let file: File | Blob = files[index];

//                         if (file && !file.type) {
//                             file = await heic2convert(file)
//                         }

//                         if ((newImages.length - 1) >= (values.selectedIndex + index)) {
//                             newImages = await Promise.all(newImages.map(async (newImage, newImageIndex) => {
//                                 if (newImageIndex === (values.selectedIndex + index)) {
//                                     const data = await toBase64(file);
//                                     return {
//                                         ...newImage,
//                                         id: uuidv4(),
//                                         image: data,
//                                         imageData: await generateCanvasImage(data),
//                                         canvasData: '',
//                                         updated: true,
//                                     };
//                                 }
//                                 return newImage;
//                             })) as {
//                                 id: string;
//                                 image: string;
//                                 imageData: string;
//                                 canvasData: string;
//                             }[];

//                         } else {
//                             const data = await toBase64(file);

//                             newImages = [
//                                 ...newImages,
//                                 {
//                                     id: uuidv4(),
//                                     image: data,
//                                     imageData: await generateCanvasImage(data),
//                                     canvasData: '',
//                                     updated: true,
//                                 }
//                             ]
//                         }
//                     }

//                     await setFieldValue('images', newImages);
//                     await setFieldValue('selectedIndex', newImages.length - 1);

//                 }}
//                 multiple
//                 accept=".png,.jpg,.jpeg,.heic"
//             />
//             <Button
//                 className="h-full"
//                 size="small"
//                 fullWidth
//                 style={{
//                     pointerEvents: 'fill',
//                 }}
//                 variant="outlined"
//                 color="secondary"
//                 onClick={() => {
//                     if (!fileRef || !fileRef?.current) return;
//                     fileRef.current.value = '';
//                     fileRef.current?.click();
//                 }}
//             >{strings.ADDFROMFILES}</Button>
//         </>
//     );
// };


export const MemoClientProcedurePicture = memo(ClientProcedurePicture);

export default ClientProcedurePicture;
