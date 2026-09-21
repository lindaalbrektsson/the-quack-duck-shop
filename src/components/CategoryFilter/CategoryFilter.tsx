import * as React from "react";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import type { SelectedCategory } from "../../types/product";

type CategoryFilterProps = {
    selectedCategory: SelectedCategory;
    setSelectedCategory : React.Dispatch<React.SetStateAction<SelectedCategory>>;
}

const CategoryFilter = ({selectedCategory, setSelectedCategory}: CategoryFilterProps ) => {

    const id = React.useId()

    return(
        <Box sx={{ minWidth: 130 }}>
      <FormControl fullWidth>
        <InputLabel variant="standard" htmlFor={`${id}-select`}>
          Category
        </InputLabel>
        <NativeSelect
          value={selectedCategory}
          onChange={(event) => {
            const value = event.target.value as SelectedCategory;
            setSelectedCategory(value)
          }}
          inputProps={{
            name: 'category',
            id: `${id}-select`,
          }}
        >
          <option value={"all"}>All</option>
          <option value={"mostPopular"}>Most Popular</option>
          <option value={"onSale"}>On Sale</option>
          <option value={"limitedEdition"}>Limited Edition</option>
        </NativeSelect>
      </FormControl>
    </Box>

    )
}

export default CategoryFilter