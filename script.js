var payBtn = document.getElementById("pay-btn"); 
payBtn.addEventListener("click", function() { 
  Solana.Checkout.open({ 
    buttonId: "your-button-id" 
  }); 
}); 

