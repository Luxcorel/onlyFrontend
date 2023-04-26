import React, {useState} from 'react';
import StandardTable from "./StandardTable"
import PieTable from "./PieTable"
import StandardToolbar from "./StandardToolbar"



export default function StudioToolbar(props) {
    const [categories, setCategories] = useState(props.categories)
    const [tableType, setTableType] = useState("column")
    const [tableKey, setTableKey] = useState(1)
    let table

    function handleCategoryCountIncrease(count){
        props.handleCategoryCountIncrease(count);
    }

    function handleCategoryCountDecrease(count){
        props.handleCategoryCountDecrease(count);
    }

    function handleDatasetAdd() {
        props.handleDatasetAdd();
    }

    function handleDatasetRemove(indexToRemove) {
        props.handleDatasetRemove(indexToRemove);
    }

    function handleDatasetDataChange(index, dataIndex, value){
        props.handleDatasetDataChange(index, dataIndex, value);
    }

    function handleDatasetNameChange(index, name){
        props.handleDatasetNameChange(index, name);
    }

    function handleCategoryNameChange(index, name){
        props.handleCategoryNameChange(index, name)
    }

    function handleChartNameChange(name){
        props.handleChartNameChange(name)
    }

    function handleYAxisNameChange(name){
        props.handleYAxisNameChange(name)
    }

    function handleChartTypeChange(type){
        setTableType(type)
        props.handleChartTypeChange(type)
    }

    function handleCategoryIdChange(id){
        props.handleCategoryIdChange(id)
    }


    switch (tableType) {
        case "pie":
            table = <PieTable
            />;
            props.putChartToInitState();
            break;
        default:

            table = <StandardTable
                handleCategoryCountIncrease={handleCategoryCountIncrease}
                handleCategoryCountDecrease={handleCategoryCountDecrease}
                handleDatasetAdd={handleDatasetAdd}
                handleDatasetRemove={handleDatasetRemove}
                handleDatasetDataChange={handleDatasetDataChange}
                handleDatasetNameChange={handleDatasetNameChange}
                handleCategoryNameChange={handleCategoryNameChange}
                handleYAxisNameChange={handleYAxisNameChange}
            />;
            props.putChartToInitState();
            break;
        }
    return (
        <>
            <StandardToolbar
                handleChartNameChange={handleChartNameChange}
                handleChartTypeChange={handleChartTypeChange}
                handleCategoryIdChange={handleCategoryIdChange}
            />
            <div className="table">
                {table}
            </div>
        </>
    )
}

