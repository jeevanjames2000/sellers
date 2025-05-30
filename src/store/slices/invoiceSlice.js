import { createSlice } from "@reduxjs/toolkit";





const initialState = {
    invoices : [],
    loading:false,
    error:null,
}

const invoicesSlice = createSlice({
    name:'invoices',
    initialState,
    reducers:{
        setInvoices : (state,action)=>{
            state.invoices = action.payload.invoices;
            state.loading = false;
            
        },
        setLoading : (state,) => {
            state.loading = true;
            state.error = null;
        },
        setError:(state,action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const {setInvoices,setLoading,setError} = invoicesSlice.actions;
export default invoicesSlice.reducer;