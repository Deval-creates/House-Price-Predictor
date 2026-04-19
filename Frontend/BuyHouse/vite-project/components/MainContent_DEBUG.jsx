// ADD THIS CODE TO YOUR MainContent.jsx

// Replace the first useEffect (around line 333) with this version that includes console.logs:

  useEffect(() => {
    console.log("=== MainContent Component Mounted ===");
    const predictedPrice = localStorage.getItem("predictedPrice");
    
    console.log("1. Checking localStorage for 'predictedPrice'");
    console.log("2. Value found:", predictedPrice);
    
    if (predictedPrice) {
      const price = parseFloat(predictedPrice);
      
      console.log("3. Parsed price as number:", price);
      console.log("4. Type of price:", typeof price);
      
      // Determine category based on price
      let category = null;
      if (price >= 250000) {
        category = "premium";
        console.log("5. Price >= 250000, category = premium");
      } else if (price >= 150000) {
        category = "mid";
        console.log("5. Price >= 150000, category = mid");
      } else {
        category = "low";
        console.log("5. Price < 150000, category = low");
      }
      
      console.log("6. Final category determined:", category);
      console.log("7. Calling setFilteredCategory with:", category);
      
      setFilteredCategory(category);
      
      console.log("8. Removing predictedPrice from localStorage");
      localStorage.removeItem("predictedPrice");
      
      console.log("9. Showing toast notification");
      // Show toast notification
      toast.info(`Showing ${category} range houses based on your prediction of $${price.toLocaleString()}`);
      
      console.log("10. ✅ Filter setup complete!");
    } else {
      console.log("❌ No predicted price found in localStorage");
      console.log("Showing all houses (normal browsing mode)");
    }
    
    console.log("=== End of useEffect ===");
  }, []);
