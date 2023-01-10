import React, { useState, useEffect, useRef } from 'react'
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
const Richtexteditor = ({ data, onEditorStateChange = {},placeholder,dir
}) => {
    const [isFocused, setIsFocused] = useState(false);
    // const editor = useRef(null);
    
    // const [editorState, setEditorState] = useState("")

// console.log("data richtext==>",data)
    return (
        <>
            <Editor
                editorState={data}
                textAlignment={dir ?"right":"left"}
                toolbarClassName={isFocused ? "" :"toolbarClassName" }
                placeholder={placeholder}          
                onFocus={()=> {setIsFocused(true)}}
                onBlur={()=>{setIsFocused(false)}}
                // toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                // textAlignment='left'

                onEditorStateChange={onEditorStateChange}


            />
        </>
    )
}

export default Richtexteditor