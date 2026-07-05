import { createContext,useState,useEffect } from "react";



const CardContext = createContext();

const CardProvider =({children})=>{
    const [cardItem,setCardItem]= useState(localStorage.getItem("cartItem")? JSON.parse(localStorage.getItem("cartItem")): []);

    useEffect(()=>{
        localStorage.setItem("cartItem", JSON.stringify(cardItem));
    },[cardItem]); 
    const AddToCard = (product)=>{
        const existProduct = cardItem.find((item)=>item.id===product.id);

        if(existProduct){
            const updateCard = cardItem.map((item)=>item.id=== product.id?{...item,qty:item.qty+1}:item); 
            setCardItem(updateCard);
        }else{
            setCardItem([...cardItem, {...product,qty:1}]); 
        }

    };
    const removeFromCard = (productId)=>{
        const updatedCart = cardItem.filter((item)=>item.id!==productId);
        setCardItem(updatedCart);
    };
    const updateQuantity = (productId, newQuantity) => {
  if (newQuantity <= 0) {
    removeFromCard(productId);
  } else {
    const updateCard = cardItem.map((item) =>
      item.id === productId ? { ...item, qty: newQuantity } : item
    );
    setCardItem(updateCard);
  }
};

    
return(
    <CardContext.Provider value={{cardItem,AddToCard,removeFromCard,updateQuantity}}>
        {children}
    </CardContext.Provider>
)
    
}

export {CardProvider};

export default CardContext;
