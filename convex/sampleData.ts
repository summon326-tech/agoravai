import { mutation } from "./_generated/server";

export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all data in order (respecting foreign key constraints)
    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }
    
    const tasks = await ctx.db.query("tasks").collect();
    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }
    
    const rooms = await ctx.db.query("rooms").collect();
    for (const room of rooms) {
      await ctx.db.delete(room._id);
    }
    
    const cinemas = await ctx.db.query("cinemas").collect();
    for (const cinema of cinemas) {
      await ctx.db.delete(cinema._id);
    }
    
    return "All data cleared successfully!";
  },
});

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingCinemas = await ctx.db.query("cinemas").collect();
    if (existingCinemas.length > 0) {
      return "Data already exists";
    }

    // Create sample cinemas
    const morumbiId = await ctx.db.insert("cinemas", {
      name: "Morumbi Town",
      location: "Shopping Morumbi Town",
      totalRooms: 0,
      activeRooms: 0,
      availability: 0,
    });

    const freiCanecaId = await ctx.db.insert("cinemas", {
      name: "Frei Caneca",
      location: "Shopping Frei Caneca",
      totalRooms: 0,
      activeRooms: 0,
      availability: 0,
    });

    const hortolandiaId = await ctx.db.insert("cinemas", {
      name: "Hortolândia",
      location: "Shopping Hortolândia",
      totalRooms: 0,
      activeRooms: 0,
      availability: 0,
    });

    // Create sample rooms for Morumbi Town
    await ctx.db.insert("rooms", {
      cinemaId: morumbiId,
      number: 1,
      status: "active",
      projector: "Christie CP2230",
      soundSystem: "Dolby Atmos 7.1",
      projectorLampModel: "CDXL-30SP",
      projectorLampHours: 1200,
      projectorLampMaxHours: 2000,
      projectorType: "lamp",
    });

    await ctx.db.insert("rooms", {
      cinemaId: morumbiId,
      number: 2,
      status: "active",
      projector: "Christie CP2230",
      soundSystem: "Dolby Atmos 7.1",
      projectorLampModel: "CDXL-30SP",
      projectorLampHours: 800,
      projectorLampMaxHours: 2000,
      projectorType: "lamp",
    });

    await ctx.db.insert("rooms", {
      cinemaId: morumbiId,
      number: 3,
      status: "maintenance",
      projector: "IMAX GT Laser",
      soundSystem: "IMAX 12-Channel",
      projectorLampModel: "RGB Laser Module",
      projectorLampHours: 15000,
      projectorLampMaxHours: 25000,
      projectorType: "laser",
    });

    // Create sample rooms for Frei Caneca
    await ctx.db.insert("rooms", {
      cinemaId: freiCanecaId,
      number: 1,
      status: "active",
      projector: "Barco DP2K-32B",
      soundSystem: "Dolby 7.1",
      projectorLampModel: "CDXL-30SP",
      projectorLampHours: 1500,
      projectorLampMaxHours: 2000,
      projectorType: "lamp",
    });

    await ctx.db.insert("rooms", {
      cinemaId: freiCanecaId,
      number: 2,
      status: "active",
      projector: "Barco DP2K-32B",
      soundSystem: "Dolby 7.1",
      projectorLampModel: "CDXL-30SP",
      projectorLampHours: 900,
      projectorLampMaxHours: 2000,
      projectorType: "lamp",
    });

    // Create sample rooms for Hortolândia
    await ctx.db.insert("rooms", {
      cinemaId: hortolandiaId,
      number: 1,
      status: "active",
      projector: "Sony SRX-R320",
      soundSystem: "Dolby 5.1",
      projectorLampModel: "LMP-F331",
      projectorLampHours: 1800,
      projectorLampMaxHours: 2000,
      projectorType: "lamp",
    });

    await ctx.db.insert("rooms", {
      cinemaId: hortolandiaId,
      number: 2,
      status: "stopped",
      projector: "Sony SRX-R320",
      soundSystem: "Dolby 5.1",
      projectorLampModel: "LMP-F331",
      projectorLampHours: 1950,
      projectorLampMaxHours: 2000,
      projectorType: "lamp",
    });

    return "Sample data created successfully!";
  },
});
