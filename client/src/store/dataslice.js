import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    movieData:[],
    TheaterData:[],
    location:null,
    show:null,
    adminTheater:null,
    onStatusChange:false
}
export const dataSlice = createSlice({

    name: "data",
    initialState,
    reducers: {
        
        setMoviesData: (state, action) => {
            state.movieData = action.payload
        },
        setTheaterData:(state,action)=>{
            state.TheaterData = action.payload
        },
        setlocation:(state,action)=>{
            state.location = action.payload
        },
        setShow:(state,action)=>{
            state.show = action.payload
        },
        setAdminTheater:(state,action)=>{
            state.adminTheater = action.payload
        },
        setOnStatusChange:(state)=>{
            state.onStatusChange = !state.onStatusChange
        }
    
    }
})
export const {setOnStatusChange,setMoviesData,setTheaterData,setlocation,setShow,setAdminTheater} = dataSlice.actions

export default dataSlice.reducer