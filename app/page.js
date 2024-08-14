"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (item, quantity) => {
    setEditingItem(item);
    setNewQuantity(quantity);
    setOpen(true);
  };

  const handleEditQuantity = async () => {
    const docRef = doc(collection(firestore, "inventory"), editingItem);
    await setDoc(docRef, { quantity: parseInt(newQuantity) });
    setNewQuantity("");
    setEditingItem(null);
    handleClose();
    await updateInventory();
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      sx={{
        background: "linear-gradient(135deg, #ccffb3 0%, #e6ccff 90%)" 
      }}
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <TextField
        label="Search Inventory"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          marginBottom: 2,
          width: "80%",
          bgcolor: "#ffffcc",
          border: "2px solid #999900",
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {editingItem ? (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Edit Quantity
              </Typography>
              <Stack width="100%" direction={"row"} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="New Quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
                <Button variant="outlined" onClick={handleEditQuantity}>
                  Save
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width="100%" direction={"row"} spacing={2}>
                <TextField
                  id="outlined-basic"
                  label="Item"
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ bgcolor: "#005ce6" }}
      >
        Add New Item
      </Button>
      <Box border={"2px solid #400080"}>
        <Box
          width="1100px"
          height="100px"
          bgcolor={"#420080"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            variant={"h3"}
            color={"#ffffff"}
            textAlign={"center"}
            sx={{ fontFamily: "Comic Sans MS, Andalé Mono, Courier" }}
          >
            PantrySmart
          </Typography>
        </Box>
        <Stack width="1100px" height="300px" overflow={"auto"}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#e6e6ff"}
              paddingX={5}
              borderBottom={"solid 2px #4d0099"}
              sx={{ boxSizing: "border-box" }}
            >
              <Typography
                variant={"h5"}
                color={"#4d3319"}
                sx={{ flex: 1, textAlign: "left" }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant={"h6"}
                color={"#804000"}
                sx={{ textAlign: "center", flex: 1 }}
              >
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#DC143C" }}
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleEditOpen(name, quantity)}
                >
                  Edit
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
