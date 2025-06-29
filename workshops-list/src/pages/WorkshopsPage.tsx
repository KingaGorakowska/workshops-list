import Pagination from '@mui/material/Pagination';
import useWorkshops from '../hooks/useWorkshops';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import WorkshopsList from '../components/workshops-list/WorkshopsList';
import FilterWorkshopSelect from '../components/header/filterWorkshopSelect/FilterWorkshopSelect';
import { useState } from 'react';
import { filterWorkshops } from '../libs/filterWorkshops';
import useAllWorkshops from '../hooks/useAllWorkshops';




const WorkshopsPage = () => {
const [searchParams, setSearchParams] = useSearchParams();
const currentPage = Number(searchParams.get("page")); 
const {workshops, isLoading, error, totalPages, filters} = useWorkshops(currentPage);
const {allWorkshops} = useAllWorkshops();

const [filtersValues, setFiltersValues] = useState({
        additional: "",
        availability: "",
        brands: "",
        districts: "",
        networks: "",
});

const handleOnChange = (key:string,value:string|number) => {

    setFiltersValues((prev)=>({
        ...prev,
        [key]:value
    }));

};

useEffect(()=>{
    if(!searchParams.get("page")){
        setSearchParams({page:"1"})
    }
},[searchParams,setSearchParams]);

const handleChange = (_:any,value:number) => {

    setSearchParams({page:value.toString()})
};

const isAnyFieldFilled = Object.values(filtersValues).some(
  value => value != null && value.toString().trim() !== ''
);

const filteredWorkshops = useMemo(()=>{
    if(!isAnyFieldFilled)return workshops;
    return filterWorkshops(allWorkshops, filtersValues);
},[filtersValues]);
    return(
        <main className="container">
            <div className="row">
                <div className="col">
                    <h1>Discover all the car workshops near you.</h1>
                    <h2>Explore a wide selection of workshops with verified reviews and ratings. Quality service is just a click away!</h2>
                    <FilterWorkshopSelect filters={filters} handleOnChange={handleOnChange}/>
                    <WorkshopsList workshops={isAnyFieldFilled?filteredWorkshops:workshops} isLoading={isLoading} error={error}/>
                    {isAnyFieldFilled===false?<div className="pagination-nav">
                        <Pagination count={totalPages} page={currentPage} onChange={handleChange}/>
                    </div>:null}
                </div>
            </div>
        </main>
    )

}

export default WorkshopsPage;