import sys
import os

# Add parent directory to path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal, engine, Base
from backend.models import Property

def seed_database():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Clear existing data to avoid duplicates
    db.query(Property).delete()
    
    properties = [
        # =========================================================================
        # --- ADDIS ABABA (አዲስ አበባ) PROPERTIES (10 Properties) ---
        # =========================================================================
        
        # 1. Addis Ababa - Buy - House
        Property(
            title="4 BHK Luxury G+2 Villa in Old Airport",
            title_am="ባለ 4 መኝታ የቅንጦት ጂ+2 ቪላ በኦልድ ኤርፖርት",
            description="Exquisite contemporary G+2 luxury villa situated in the diplomatic enclave of Old Airport, Addis Ababa. Features landscaped private garden, modern European kitchen, master bedroom with jacuzzi and walk-in closet, maid quarters, 3-phase backup generator, 10,000L water tanker, and CCTV security.",
            description_am="በአዲስ አበባ ዲፕሎማቲክ ሰፈር ኦልድ ኤርፖርት የሚገኝ ውብ የዘመናዊ ጂ+2 ቪላ። ሰፊ የግል የአትክልት ስፍራ፣ የዘመናዊ አውሮፓውያን ሞጁላር ማብሰያ ቤት፣ ጃኩዚና ሰፊ ቁምሳጥን ያለው ዋና መኝታ ክፍል፣ የሰራተኛ ክፍል፣ የ3-ፌዝ ተጠባባቂ ጄኔሬተር፣ 10,000 ሊትር የውሃ ታንከር እና የCCTV ካሜራ ጥበቃ አለው።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Old Airport",
            locality_am="ኦልድ ኤርፖርት",
            price=85000000.0,
            price_formatted="85,000,000 ETB",
            price_formatted_am="85,000,000 ብር",
            purpose="buy",
            property_type="house",
            bhk=4,
            bathrooms=5,
            area=450,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            amenities="Backup Generator, 10000L Water Tank, Private Garden, Maid Quarters, CCTV Security, 4 Car Parking",
            amenities_am="ተጠባባቂ ጄኔሬተር, 10000 ሊ የውሃ ታንከር, የግል ጊቢ, የሰራተኛ ክፍል, CCTV ጥበቃ, 4 መኪና ማቆሚያ"
        ),

        # 2. Addis Ababa - Buy - Flat
        Property(
            title="3 BHK High-End Apartment in Bole Medhanialem",
            title_am="ባለ 3 መኝታ ቅንጦት አፓርታማ በቦሌ መድኃኔዓለም",
            description="Prestigious 3-bedroom apartment located in prime Bole near Medhanialem. Enjoy stunning city views, elevator access, backup generator, underground parking, integrated kitchen appliances, and 24/7 security.",
            description_am="በተመራጩ የቦሌ መድኃኔዓለም አካባቢ የሚገኝ ደረጃውን የጠበቀ ባለ 3 መኝታ አፓርታማ። ማራኪ የከተማ እይታ፣ ዘመናዊ ሊፍት፣ ተጠባባቂ ጄኔሬተር፣ የመሬት ውስጥ የመኪና ማቆሚያ፣ የተሟላ ዘመናዊ የኩሽና እቃዎች እና የ24/7 ጥበቃ ያካተተ።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Bole",
            locality_am="ቦሌ",
            price=32000000.0,
            price_formatted="32,000,000 ETB",
            price_formatted_am="32,000,000 ብር",
            purpose="buy",
            property_type="flat",
            bhk=3,
            bathrooms=3,
            area=190,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            amenities="Automatic Elevator, Standby Generator, Underground Parking, Water Reservoir, Intercom, Security",
            amenities_am="ዘመናዊ ሊፍት, ተጠባባቂ ጄኔሬተር, የምድር ውስጥ ማቆሚያ, የውሃ ማጠራቀሚያ, ኢንተርኮም, አስተማማኝ ጥበቃ"
        ),

        # 3. Addis Ababa - Buy - Flat
        Property(
            title="2 BHK Modern Flat in Kazanchis Financial District",
            title_am="ባለ 2 መኝታ ዘመናዊ አፓርታማ በካዛንቺስ",
            description="Conveniently situated in the bustling Kazanchis financial hub, steps from UNECA and Intercontinental. Ideal for corporate professionals and high-yield rental investments. Features balcony, fitted wardrobes, and gym facilities.",
            description_am="በካዛንቺስ የንግድና የፋይናንስ ማዕከል ከኢኮኖሚክ ኮሚሽን (UNECA) አጠገብ የሚገኝ ምቹ ባለ 2 መኝታ አፓርታማ። ለባለሙያዎች እና ለኪራይ ገቢ ኢንቨስትመንት እጅግ ተመራጭ። ሰፊ በረንዳ፣ ቁምሳጥንና የጅምናዚየም አገልግሎት ያለው።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Kazanchis",
            locality_am="ካዛንቺስ",
            price=21500000.0,
            price_formatted="21,500,000 ETB",
            price_formatted_am="21,500,000 ብር",
            purpose="buy",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=125,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            amenities="Gymnasium, Backup Power, Reserved Parking, Balcony View, Fire Protection",
            amenities_am="ጅምናዚየም, ተጠባባቂ መብራት, የተመደበ ማቆሚያ, የበረንዳ እይታ, የእሳት መከላከያ"
        ),

        # 4. Addis Ababa - Buy - House
        Property(
            title="3 BHK Independent Townhouse in CMC Tsehay Real Estate",
            title_am="ባለ 3 መኝታ ቪላ ቤት በሲኤምሲ ፀሐይ ሪል እስቴት",
            description="Elegant 3-bedroom family townhouse in the serene, gated community of CMC. Includes private front compound, sunny terrace, solar water heater, modern bathroom tiles, and 24-hour guarded gate.",
            description_am="በሲኤምሲ ፀሐይ ሪል እስቴት አስተማማኝ ቅጥር ግቢ ውስጥ የሚገኝ ድንቅ ባለ 3 መኝታ ቤት። የፊት ጊቢ፣ ፀሐያማ ሰገነት፣ የፀሐይ ውሃ ማሞቂያ፣ ዘመናዊ መታጠቢያ ቤቶች እና የ24 ሰዓት የበር ጥበቃ ያለው።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="CMC",
            locality_am="ሲኤምሲ",
            price=46000000.0,
            price_formatted="46,000,000 ETB",
            price_formatted_am="46,000,000 ብር",
            purpose="buy",
            property_type="house",
            bhk=3,
            bathrooms=3,
            area=280,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
            amenities="Gated Security, Private Yard, Solar Water Heater, Water Reservoir, Parking for 2 Cars",
            amenities_am="የተከበረ ጊቢ, የግል ግቢ, የፀሐይ ውሃ ማሞቂያ, የውሃ ታንከር, 2 መኪና ማቆሚያ"
        ),

        # 5. Addis Ababa - Buy - Flat
        Property(
            title="1 BHK Cozy Flat in Ayat Sub-City",
            title_am="ባለ 1 መኝታ ምቹ አፓርታማ በአያት",
            description="Affordable and neat 1-bedroom flat close to Ayat Light Rail Station. Perfect starter home or bachelor residence with open kitchen layout, water reservoir access, and low service fee.",
            description_am="በአያት ቀላል ባቡር ጣቢያ አቅራቢያ የሚገኝ ተመጣጣኝና ንፁህ ባለ 1 መኝታ አፓርታማ። ክፍት የአሜሪካን ኩሽና፣ አስተማማኝ የውሃ ማጠራቀሚያ እና አነስተኛ የአገልግሎት ክፍያ ያለው።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Ayat",
            locality_am="አያት",
            price=9800000.0,
            price_formatted="9,800,000 ETB",
            price_formatted_am="9,800,000 ብር",
            purpose="buy",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=70,
            furnishing="Unfurnished",
            furnishing_am="ያልተሟላ እቃ",
            image_url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
            amenities="Near LRT Station, Water Reservoir, Security, Balcony, Secure Parking",
            amenities_am="በባቡር ጣቢያ አቅራቢያ, የውሃ ማጠራቀሚያ, አስተማማኝ ጥበቃ, በረንዳ, የተጠበቀ ማቆሚያ"
        ),

        # 6. Addis Ababa - Rent - Flat
        Property(
            title="3 BHK Luxury Furnished Flat in Sarbet (Near AU)",
            title_am="ባለ 3 መኝታ የቅንጦት የተሟላ አፓርታማ በሳርቤት (አፍሪካ ህብረት አጠገብ)",
            description="Spacious high-floor apartment overlooking the African Union Headquarters and South Addis. Features plush leather sofas, smart TV, washing machine, standby generator, and elevator.",
            description_am="በሳርቤት ከአፍሪካ ህብረት ዋና መ/ቤት አቅራቢያ የሚገኝ ማራኪ ባለ 3 መኝታ አፓርታማ። ምቹ የሳሎን እቃዎች፣ ስማርት ቲቪ፣ ዘመናዊ የልብስ ማጠቢያ፣ ጄኔሬተርና ሊፍት የተሟላለት።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Sarbet",
            locality_am="ሳርቤት",
            price=140000.0,
            price_formatted="140,000 ETB/month",
            price_formatted_am="140,000 ብር/ወር",
            purpose="rent",
            property_type="flat",
            bhk=3,
            bathrooms=2,
            area=175,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            amenities="City Views, High Speed Lift, Full Generator Backup, Wi-Fi Ready, 24/7 Guards",
            amenities_am="የከተማ እይታ, ፈጣን ሊፍት, ሙሉ ጄኔሬተር, ዋይፋይ የተዘጋጀ, 24/7 ጥበቃ"
        ),

        # 7. Addis Ababa - Rent - House
        Property(
            title="4 BHK Spacious Residential Villa in Summit",
            title_am="ባለ 4 መኝታ ሰፊ የመኖሪያ ቪላ በሰሚት",
            description="Stand-alone two-story residential house in a peaceful Summit neighborhood. Includes green front lawn, traditional coffee area, guardroom, service quarter, and large water storage.",
            description_am="በሰሚት ፀጥታ የሰፈነበት አካባቢ የሚገኝ ባለ 4 መኝታ ባለ ሁለት ፎቅ ቪላ። ሳር የተከለለበት ጊቢ፣ የባህል ቡና ማፍያ ቦታ፣ የጥበቃ ክፍል፣ የሰራተኛ ማረፊያ እና ትልቅ የውሃ ማጠራቀሚያ ታንከር ያለው።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Summit",
            locality_am="ሰሚት",
            price=95000.0,
            price_formatted="95,000 ETB/month",
            price_formatted_am="95,000 ብር/ወር",
            purpose="rent",
            property_type="house",
            bhk=4,
            bathrooms=3,
            area=320,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            amenities="Spacious Garden, Traditional Kitchen, Service Room, 3 Car Compound, Water Pump",
            amenities_am="ሰፊ የአትክልት ስፍራ, የባህል ኩሽና, የሰራተኛ ክፍል, ለ3 መኪና የሚሆን ግቢ, የውሃ ፓምፕ"
        ),

        # 8. Addis Ababa - Rent - Flat
        Property(
            title="2 BHK Cozy Flat in Bole Atlas",
            title_am="ባለ 2 መኝታ ምቹ አፓርታማ በቦሌ አትላስ",
            description="Convenient 2-bedroom rental apartment steps away from hotels, restaurants, and shopping centers in Bole Atlas. Equipped with modern kitchen cabinets, backup generator, and elevator.",
            description_am="በቦሌ አትላስ ከሆቴሎችና ሬስቶራንቶች አቅራቢያ የሚገኝ ተወዳጅ ባለ 2 መኝታ የኪራይ አፓርታማ። ዘመናዊ የኩሽና ካቢኔት፣ ተጠባባቂ ጄኔሬተር እና ሊፍት ያለው።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Bole",
            locality_am="ቦሌ",
            price=65000.0,
            price_formatted="65,000 ETB/month",
            price_formatted_am="65,000 ብር/ወር",
            purpose="rent",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=115,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
            amenities="Central Location, Elevator, Backup Power, Balcony, Secure Entry",
            amenities_am="መሀል ከተማ, ዘመናዊ ሊፍት, ጄኔሬተር, በረንዳ, የተጠበቀ መግቢያ"
        ),

        # 9. Addis Ababa - Rent - Flat
        Property(
            title="1 BHK Studio Apartment in Gerji",
            title_am="ባለ 1 መኝታ ስቱዲዮ አፓርታማ በገርጂ",
            description="Bright and modern 1-bedroom studio in Gerji Mebrat Hail. Offers water tank supply, security guard, parking space, and easy access to transportation.",
            description_am="በገርጂ መብራት ኃይል የሚገኝ ፀሐያማና ዘመናዊ ባለ 1 መኝታ ስቱዲዮ አፓርታማ። አስተማማኝ የውሃ አቅርቦት፣ የጥበቃ አገልግሎት፣ የመኪና ማቆሚያ እና ለትራንስፖርት ምቹ።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Gerji",
            locality_am="ገርጂ",
            price=35000.0,
            price_formatted="35,000 ETB/month",
            price_formatted_am="35,000 ብር/ወር",
            purpose="rent",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=65,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
            amenities="Water Tank, 24/7 Guard, Balcony, Parking, Easy Transport Access",
            amenities_am="የውሃ ታንከር, 24/7 ጥበቃ, በረንዳ, መኪና ማቆሚያ, የትራንስፖርት አማራጭ"
        ),

        # 10. Addis Ababa - Rent - House
        Property(
            title="5 BHK Diplomatic Residence in Lebu Varnero",
            title_am="ባለ 5 መኝታ የዲፕሎማት መኖሪያ ቪላ በሌቡ ቫርኔሮ",
            description="Magnificent high-security 5-bedroom residence in the exclusive Lebu Varnero gated community. Features wooden floors, double-height living room, private tennis court access, large manicured garden, and staff quarters.",
            description_am="በሌቡ ቫርኔሮ ዝግ ማህበረሰብ ውስጥ የሚገኝ ድንቅ ባለ 5 መኝታ ከፍተኛ ጥበቃ ያለው ቪላ። የወለል ፓርኬት፣ ባለ ሁለት ፎቅ ከፍታ ያለው ሰፊ ሳሎን፣ የቴኒስ ሜዳ፣ ያማረ የጓሮ አትክልትና የሰራተኞች ማረፊያ ያካተተ።",
            city="Addis Ababa",
            city_am="አዲስ አበባ",
            locality="Lebu",
            locality_am="ሌቡ",
            price=220000.0,
            price_formatted="220,000 ETB/month",
            price_formatted_am="220,000 ብር/ወር",
            purpose="rent",
            property_type="house",
            bhk=5,
            bathrooms=5,
            area=500,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
            amenities="Security Post, Manicured Lawn, Staff Quarters, Solar Heating, High-capacity Generator",
            amenities_am="የጥበቃ ፖስት, ያማረ ሳር ግቢ, የሰራተኛ ማረፊያ, የፀሐይ ማሞቂያ, ከፍተኛ ጄኔሬተር"
        ),

        # =========================================================================
        # --- ADAMA (አዳማ / ናዝሬት) PROPERTIES (10 Properties) ---
        # =========================================================================

        # 11. Adama - Buy - House
        Property(
            title="4 BHK Luxury G+1 Villa in Bole Sub-City, Adama",
            title_am="ባለ 4 መኝታ ዘመናዊ ጂ+1 ቪላ በአዳማ ቦሌ ክፍለ ከተማ",
            description="Spectacular G+1 independent villa in Adama's Bole residential sector. Highlights include stone-paved compound, modern salon, balcony with views of Mount Boku, standby generator, and private water borehole.",
            description_am="በአዳማ ቦሌ ሰፈር የሚገኝ ማራኪ ባለ 4 መኝታ ጂ+1 ቪላ። በድንጋይ ያማረ ቅጥር ግቢ፣ ሰፊ ሳሎን፣ የቦኩ ተራራ እይታ ያለው ሰገነት፣ ተጠባባቂ ጄኔሬተር እና የግል የቦርቧ ውሃ አቅርቦት ያለው።",
            city="Adama",
            city_am="አዳማ",
            locality="Bole Sub-City",
            locality_am="ቦሌ ክፍለ ከተማ",
            price=24000000.0,
            price_formatted="24,000,000 ETB",
            price_formatted_am="24,000,000 ብር",
            purpose="buy",
            property_type="house",
            bhk=4,
            bathrooms=4,
            area=350,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            amenities="Borehole Water, Standby Power, Balcony Mountain Views, 3 Car Parking, Perimeter Fence",
            amenities_am="የቦርቧ ውሃ, ተጠባባቂ መብራት, የተራራ እይታ ሰገነት, 3 መኪና ማቆሚያ, ጠንካራ አጥር"
        ),

        # 12. Adama - Buy - Flat
        Property(
            title="3 BHK Modern Flat in Dembela, Central Adama",
            title_am="ባለ 3 መኝታ አዲስ አፓርታማ በደምበላ አዳማ",
            description="Brand-new 3-bedroom apartment on the 4th floor of a prestigious mixed-use building in Dembela. Comes with ceramic tiling, elevator, underground water reservoir, and prime commercial proximity.",
            description_am="በደምበላ መሀል ከተማ በ4ኛ ፎቅ ላይ የሚገኝ አዲስ ባለ 3 መኝታ አፓርታማ። የሴራሚክ ወለል፣ ዘመናዊ ሊፍት፣ የመሬት ውስጥ የውሃ ማጠራቀሚያ እና ለገበያ ማዕከላት ቅርብ።",
            city="Adama",
            city_am="አዳማ",
            locality="Dembela",
            locality_am="ደምበላ",
            price=14500000.0,
            price_formatted="14,500,000 ETB",
            price_formatted_am="14,500,000 ብር",
            purpose="buy",
            property_type="flat",
            bhk=3,
            bathrooms=2,
            area=150,
            furnishing="Unfurnished",
            furnishing_am="ያልተሟላ እቃ",
            image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            amenities="Elevator, Commercial Hub Access, Water Reservoir, Balcony, Secure Basement Parking",
            amenities_am="ሊፍት, ለንግድ ማዕከል ቅርብ, የውሃ ማጠራቀሚያ, በረንዳ, የተጠበቀ ምድር ማቆሚያ"
        ),

        # 13. Adama - Buy - Flat
        Property(
            title="2 BHK Stylish Apartment in Posta Bet Area",
            title_am="ባለ 2 መኝታ ቅንጡ አፓርታማ በፖስታ ቤት አካባቢ",
            description="Nicely finished 2-bedroom condominium flat in the heart of Adama Posta Bet. High-speed internet connection ready, continuous water supply, and sunny living space.",
            description_am="በአዳማ ፖስታ ቤት አካባቢ የሚገኝ ጥራት ባለው አጨራረስ የተሰራ ባለ 2 መኝታ ኮንዶሚኒየም አፓርታማ። የፈጣን ኢንተርኔት መስመር የተዘረጋለት፣ አስተማማኝ የውሃ አቅርቦት እና ፀሐያማ ሳሎን።",
            city="Adama",
            city_am="አዳማ",
            locality="Posta Bet",
            locality_am="ፖስታ ቤት",
            price=8900000.0,
            price_formatted="8,900,000 ETB",
            price_formatted_am="8,900,000 ብር",
            purpose="buy",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=105,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            amenities="Central Location, Water Tank, CCTV, Tiled Flooring, Safe Gated Entrance",
            amenities_am="መሀል ከተማ, የውሃ ታንከር, የCCTV ካሜራ, የሴራሚክ ወለል, የተጠበቀ በር"
        ),

        # 14. Adama - Buy - House
        Property(
            title="3 BHK Standalone House near Wonji Road",
            title_am="ባለ 3 መኝታ ራሱን የቻለ ቤት በወንጂ መንገድ አዳማ",
            description="Spacious standalone family home situated just off Wonji Road. Features wide paved driveway, mature fruit trees (mango and avocado), separate store room, and perimeter wall.",
            description_am="በወንጂ መንገድ አቅራቢያ የሚገኝ ሰፊ ራሱን የቻለ የቤተሰብ መኖሪያ ቤት። ሰፊ ኮብልስቶን የተነጠፈበት ጊቢ፣ የማንጎ እና የአቮካዶ ዛፎች፣ ጓዳ እና ዙሪያውን የታጠረ ጠንካራ አጥር።",
            city="Adama",
            city_am="አዳማ",
            locality="Wonji Road",
            locality_am="ወንጂ መንገድ",
            price=17500000.0,
            price_formatted="17,500,000 ETB",
            price_formatted_am="17,500,000 ብር",
            purpose="buy",
            property_type="house",
            bhk=3,
            bathrooms=2,
            area=300,
            furnishing="Unfurnished",
            furnishing_am="ያልተሟላ እቃ",
            image_url="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
            amenities="Fruit Trees, Storage Room, High Security Wall, Large Compound, Ample Parking",
            amenities_am="የፍራፍሬ ዛፎች, የእቃ ማከማቻ, ረጅም አጥር, ሰፊ ግቢ, የመኪና ማቆሚያ"
        ),

        # 15. Adama - Buy - Flat
        Property(
            title="1 BHK Starter Flat in Boku Hillside",
            title_am="ባለ 1 መኝታ ተመጣጣኝ አፓርታማ በቦኩ",
            description="Great investment or first-time home buyer opportunity. 1-bedroom flat offering fresh Rift Valley breeze, modern bathroom, and secure society gate.",
            description_am="ለጀማሪ ገዢዎች ወይም ለኢንቨስትመንት ተስማሚ የሆነ ባለ 1 መኝታ አፓርታማ። ንፁህ የስምጥ ሸለቆ አየር፣ ዘመናዊ መታጠቢያ ቤት እና አስተማማኝ ጥበቃ ያለው።",
            city="Adama",
            city_am="አዳማ",
            locality="Boku",
            locality_am="ቦኩ",
            price=5400000.0,
            price_formatted="5,400,000 ETB",
            price_formatted_am="5,400,000 ብር",
            purpose="buy",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=60,
            furnishing="Unfurnished",
            furnishing_am="ያልተሟላ እቃ",
            image_url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
            amenities="Breezy Hillside, Guarded Entrance, Water Tank, Low Maintenance",
            amenities_am="ንፁህ አየር, የተጠበቀ በር, የውሃ ታንከር, አነስተኛ ወጪ"
        ),

        # 16. Adama - Rent - Flat
        Property(
            title="2 BHK Furnished Flat in Central Adama (Near Ras Hotel)",
            title_am="ባለ 2 መኝታ የተሟላ አፓርታማ በመሀል አዳማ (ራስ ሆቴል አጠገብ)",
            description="Comfortable fully furnished flat with living room sofas, dining table, flat-screen TV, modern kitchen appliances, and 24/7 security guard.",
            description_am="በአዳማ መሀል ከተማ ከራስ ሆቴል አጠገብ የሚገኝ ምቹና ሙሉ እቃ የተሟላለት አፓርታማ። የሳሎን ሶፋዎች፣ የመመገቢያ ጠረጴዛ፣ ፍላት ቲቪ፣ ዘመናዊ ኩሽና እና የ24/7 ጥበቃ።",
            city="Adama",
            city_am="አዳማ",
            locality="Central Adama",
            locality_am="መሀል አዳማ",
            price=38000.0,
            price_formatted="38,000 ETB/month",
            price_formatted_am="38,000 ብር/ወር",
            purpose="rent",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=95,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
            amenities="Fully Furnished, Smart TV, Water Tanker, Security, City Center Access",
            amenities_am="ሙሉ እቃ የተሟላለት, ስማርት ቲቪ, የውሃ ታንከር, አስተማማኝ ጥበቃ, መሀል ከተማ"
        ),

        # 17. Adama - Rent - Flat
        Property(
            title="3 BHK Spacious Flat in Migira Residential Zone",
            title_am="ባለ 3 መኝታ ሰፊ አፓርታማ በሚጊራ ሰፈር አዳማ",
            description="Bright 3-bedroom flat in a family-friendly complex in Migira. Offers spacious bedrooms, built-in closets, water pump, and dedicated parking.",
            description_am="በሚጊራ ሰፈር ለቤተሰብ ምቹ በሆነ ህንፃ ውስጥ የሚገኝ ብሩህ ባለ 3 መኝታ አፓርታማ። ሰፋፊ መኝታ ክፍሎች፣ ቁምሳጥን፣ የውሃ ፓምፕ እና የግል መኪና ማቆሚያ ያለው።",
            city="Adama",
            city_am="አዳማ",
            locality="Migira",
            locality_am="ሚጊራ",
            price=48000.0,
            price_formatted="48,000 ETB/month",
            price_formatted_am="48,000 ብር/ወር",
            purpose="rent",
            property_type="flat",
            bhk=3,
            bathrooms=2,
            area=140,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            amenities="Spacious Rooms, Balcony, Water Pump, Gated Society, Parking",
            amenities_am="ሰፋፊ ክፍሎች, በረንዳ, የውሃ ፓምፕ, የተከለለ ጊቢ, መኪና ማቆሚያ"
        ),

        # 18. Adama - Rent - House
        Property(
            title="3 BHK Independent Villa in Geda Residential Enclave",
            title_am="ባለ 3 መኝታ ቪላ ቤት በገዳ ሰፈር አዳማ",
            description="Charming 3-bedroom single-family house located in quiet Geda. Features large shaded veranda, flower garden, separate servant room, and 2-car compound.",
            description_am="በገዳ ሰፈር ፀጥታ ባለው አካባቢ የሚገኝ ድንቅ ባለ 3 መኝታ ቪላ። ሰፊ ጥላ ያለው በረንዳ፣ ያማረ የአበባ አትክልት፣ የሰራተኛ ክፍል እና ለ2 መኪና የሚሆን ጊቢ።",
            city="Adama",
            city_am="አዳማ",
            locality="Geda",
            locality_am="ገዳ",
            price=55000.0,
            price_formatted="55,000 ETB/month",
            price_formatted_am="55,000 ብር/ወር",
            purpose="rent",
            property_type="house",
            bhk=3,
            bathrooms=2,
            area=240,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            amenities="Flower Garden, Shaded Veranda, Service Room, 2 Car Parking, Water Tank",
            amenities_am="የአበባ አትክልት, ሰፊ በረንዳ, የሰራተኛ ክፍል, 2 መኪና ማቆሚያ, የውሃ ታንከር"
        ),

        # 19. Adama - Rent - Flat
        Property(
            title="1 BHK Compact Apartment near Adama University (ASTU)",
            title_am="ባለ 1 መኝታ አፓርታማ በአዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ አጠገብ",
            description="Perfect for university instructors or researchers. Clean 1-bedroom flat with study nook, fast internet access, and continuous municipal + tank water supply.",
            description_am="ለዩኒቨርሲቲ መምህራን ወይም ተመራማሪዎች እጅግ ተስማሚ። የጥናት ጠረጴዛ ቦታ ያለው፣ ፈጣን ኢንተርኔት፣ እና አስተማማኝ የውሃ ታንከር የተገጠመለት ባለ 1 መኝታ አፓርታማ።",
            city="Adama",
            city_am="አዳማ",
            locality="Dembela",
            locality_am="ደምበላ",
            price=22000.0,
            price_formatted="22,000 ETB/month",
            price_formatted_am="22,000 ብር/ወር",
            purpose="rent",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=55,
            furnishing="Semi-Furnished",
            furnishing_am="ከፊል እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
            amenities="Near ASTU Campus, High Speed Internet, Water Tank, Tiled Floor",
            amenities_am="ከአዳማ ዩኒቨርሲቲ አጠገብ, ፈጣን ኢንተርኔት, የውሃ ታንከር, የሴራሚክ ወለል"
        ),

        # 20. Adama - Rent - House
        Property(
            title="4 BHK Luxury G+1 House with Swimming Pool Access",
            title_am="ባለ 4 መኝታ የቅንጦት ጂ+1 ቪላ በአዳማ",
            description="Premium executive villa in Adama. Features 4 ensuite bedrooms, modern open-plan kitchen, generator, perimeter electric fence, security cameras, and swimming pool privilege.",
            description_am="በአዳማ የሚገኝ ደረጃውን የጠበቀ የቅንጦት ጂ+1 ቪላ። 4 ራሳቸውን የቻሉ መታጠቢያ ያላቸው መኝታ ቤቶች፣ ክፍት ዘመናዊ ኩሽና፣ ጄኔሬተር፣ የኤሌክትሪክ አጥርና የደህንነት ካሜራዎች።",
            city="Adama",
            city_am="አዳማ",
            locality="Bole Sub-City",
            locality_am="ቦሌ ክፍለ ከተማ",
            price=110000.0,
            price_formatted="110,000 ETB/month",
            price_formatted_am="110,000 ብር/ወር",
            purpose="rent",
            property_type="house",
            bhk=4,
            bathrooms=4,
            area=400,
            furnishing="Fully Furnished",
            furnishing_am="ሙሉ እቃ ያለው",
            image_url="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
            amenities="Ensuite Bedrooms, Generator, Electric Fence, CCTV, Swimming Pool Access",
            amenities_am="የውስጥ መታጠቢያ ያላቸው ክፍሎች, ጄኔሬተር, የኤሌክትሪክ አጥር, CCTV, የዋና ገንዳ"
        )
    ]
    
    db.add_all(properties)
    db.commit()
    db.close()
    print("Database successfully seeded with 20 Ethiopian properties (Addis Ababa & Adama)!")

if __name__ == "__main__":
    seed_database()
