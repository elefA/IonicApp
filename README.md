# IonicApp
Mobile application for inventory count

This application facilitates a company to count their stock. The store was divided into zones and the items had different measurement units.

The admin user first synchronised all mobiles with the server to fetch all products, meas. units and zones.

Then users could use the app to barcode scan, or search items in order to count them. All counts were stored internally in
an SQLite Database until they were sent back to the server.
