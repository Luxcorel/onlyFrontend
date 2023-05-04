import React, {useState} from 'react';
import StandardTable from "./StandardTable"
import PieTable from "./PieTable"
import StandardToolbar from "./StandardToolbar"
import {useLocation} from "react-router-dom";
import axios from "axios";



export default function StudioToolbar(props) {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const editModule = searchParams.get("editModule") || false;
    const moduleIndex = searchParams.get("moduleIndex") || 0;

    const [categories, setCategories] = useState(props.categories)
    const [tableType, setTableType] = useState("column")
    const [tableKey, setTableKey] = useState(1)
    const [submitButton, setSubmitButton] = useState(
        searchParams.get("editModule") === "true" ? "Update" : "Submit"
    )
    let table

    function deleteChart(){
        axios.delete()
    }

    switch (tableType) {
        case "pie":
            table = <PieTable
            />;
            break;
        default:

            table = <StandardTable
                setStudioChart={props.setStudioChart}
                studioChart={props.studioChart}
                colorscheme={props.colorscheme}
            />;
            break;
        }
    return (
        <>
            {/* --STANDARD TOOLBAR-- */}
            <StandardToolbar
                setCategoryId={props.setCategoryId}
                setStudioChart={props.setStudioChart}
                studioChart={props.studioChart}
                setTableType={setTableType}
                setSubmitButton={setSubmitButton}
            />
            {/* --TABLE TOOLBAR-- */}
            <div className="table">
                {table}
            </div>
            {/* --SUBMIT BUTTON-- */}
            <div className="studio--submit">
                <button onClick={() => props.createChart()}> {submitButton}</button>
                {editModule && (
                    <button onClick={() => deleteChart()}>
                        Delete
                    </button>
                )}
            </div>

        </>

    )
}

