import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import Paragraph from '@editorjs/paragraph';
import React from "react";
import strings from "../../lang/Lang";
import TinyError from "../Error/TinyError";
// const List = require('@editorjs/list');
// const Paragraph = require('@editorjs/paragraph');
// const Header = require('@editorjs/header');


export interface EditorJSProps {
    value?: any,
    onChange?: (data: any) => void,
    error?: boolean,
    helperText?: string,
}

const EditorJSComponent: React.FC<EditorJSProps> = ({
    value,
    error = false,
    onChange = () => {},
    helperText = '',
}) => {
    const editorRef = React.useRef<null | EditorJS>(null);

    React.useEffect(() => {

        editorRef.current = new EditorJS({
            placeholder: strings.start_writing_here,
            tools: {
                header: {
                    // @ts-ignore
                    class: Header,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+H',
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+L',
                },
            },
            onReady: () => {
                if (editorRef?.current) {
                    editorRef.current.save().then((json) => {
                        onChange(json);
                    });
                }
            },
            onChange: (api) => {
                api.saver.save().then((json) => {
                    onChange(json);
                });
            }
        });

        if (editorRef?.current) {
            editorRef.current.isReady.then(() => {

                if (typeof value === 'object') {
                    editorRef?.current?.render(value);
                } else if (typeof value === 'string') {
                    editorRef?.current?.render({
                        time: 1594970048139,
                        blocks: [
                            {
                                type: 'paragraph',
                                data: {
                                    text: value,
                                },
                            },
                        ],
                        version: '2.18.0',
                    });
                }
            });
        }

        return () => {
            if (editorRef?.current) {
                editorRef?.current.destroy();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <>
            <div className={`border rounded focus-within:border-gray-200 dark:border-gray-600 px-4 ${error ? 'border-error' : ''}`} style={{
                maxHeight: '500px',
                overflow: 'hidden auto',
                padding: '.4rem',
            }}>
                {/* Editorjs id */}
                <div id="editorjs" />
            </div>
            <TinyError
                error={error}
                helperText={helperText}
            />
        </>
    );
}

export default EditorJSComponent;