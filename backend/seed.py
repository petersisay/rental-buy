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
        # --- BANGALORE PROPERTIES ---
        # 1. Bangalore - Buy - House
        Property(
            title="4 BHK Luxury Villa in Whitefield",
            description="Experience ultimate luxury in this gorgeous 4 BHK independent villa. Located in the heart of Whitefield's tech corridor, this house offers an expansive private lawn, double-height ceilings, modular Italian kitchen, home automation, and 24/7 security. Perfect for families looking for elegance and privacy.",
            city="Bangalore",
            locality="Whitefield",
            price=32000000.0,
            price_formatted="₹3.2 Crore",
            purpose="buy",
            property_type="house",
            bhk=4,
            bathrooms=4,
            area=3500,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            amenities="Private Garden, Gym, Swimming Pool, Home Automation, 24/7 Security, Power Backup"
        ),
        # 2. Bangalore - Buy - Flat
        Property(
            title="3 BHK Premium Apartment in Indiranagar",
            description="Located in one of Bangalore's most vibrant residential zones, this premium 3 BHK flat features spacious balconies, VRV air conditioning, and top-tier finishes. Steps away from fine dining, cafes, and Metro.",
            city="Bangalore",
            locality="Indiranagar",
            price=18500000.0,
            price_formatted="₹1.85 Crore",
            purpose="buy",
            property_type="flat",
            bhk=3,
            bathrooms=3,
            area=1800,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            amenities="Swimming Pool, Club House, Underground Parking, Gym, Elevators, Video Door Phone"
        ),
        # 3. Bangalore - Buy - Flat
        Property(
            title="2 BHK Modern Flat in HSR Layout",
            description="Smartly designed 2 BHK apartment in Sector 3, HSR Layout. Excellent natural ventilation, modular kitchen, chimney, wardrobes in all rooms, and direct access to utility area. Ideal for young professionals.",
            city="Bangalore",
            locality="HSR Layout",
            price=8500000.0,
            price_formatted="₹85 Lakh",
            purpose="buy",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=1200,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            amenities="Covered Parking, Power Backup, Security Guards, Rainwater Harvesting, Intercom"
        ),
        # 4. Bangalore - Buy - House
        Property(
            title="3 BHK Independent House in Koramangala",
            description="Spacious independent house located in a quiet tree-lined lane of Koramangala 4th Block. The property features a private terrace, private car park garage, and beautiful vaastu-compliant layout.",
            city="Bangalore",
            locality="Koramangala",
            price=21000000.0,
            price_formatted="₹2.1 Crore",
            purpose="buy",
            property_type="house",
            bhk=3,
            bathrooms=3,
            area=2200,
            furnishing="Unfurnished",
            image_url="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
            amenities="Private Terrace, Garage, Borewell Water, Pet Friendly, Utility Room"
        ),
        # 5. Bangalore - Buy - Flat
        Property(
            title="1 BHK Smart Studio Flat in Electronic City",
            description="Compact and stylish studio apartment in Phase 1, Electronic City. Comes fully furnished with modern appliances, space-saving furniture, and high-speed fiber-optic cabling. High rental yield.",
            city="Bangalore",
            locality="Electronic City",
            price=4200000.0,
            price_formatted="₹42 Lakh",
            purpose="buy",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=650,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
            amenities="Rooftop Gym, Coworking Lounge, Laundry Facility, 24/7 Security, High Speed Elevator"
        ),
        # 6. Bangalore - Rent - Flat
        Property(
            title="3 BHK Highrise Apartment in Hebbal",
            description="Stunning 3 BHK apartment on the 18th floor offering views of the Hebbal Lake. Features central gas line connection, massive master suite with walk-in closet, and modern light fixtures.",
            city="Bangalore",
            locality="Hebbal",
            price=55000.0,
            price_formatted="₹55,000/month",
            purpose="rent",
            property_type="flat",
            bhk=3,
            bathrooms=3,
            area=1650,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            amenities="Lake View, Tennis Court, Clubhouse, Swimming Pool, Piped Gas, Basement Parking"
        ),
        # 7. Bangalore - Rent - House
        Property(
            title="3 BHK Independent Villa on Sarjapur Road",
            description="Fabulous gated community villa with high ceilings and marble flooring. Features a small front garden, backyard sit-out space, and solar water heating. Peaceful living away from traffic.",
            city="Bangalore",
            locality="Sarjapur Road",
            price=75000.0,
            price_formatted="₹75,000/month",
            purpose="rent",
            property_type="house",
            bhk=3,
            bathrooms=3,
            area=2400,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            amenities="Gated Community, Children's Play Area, Club House, Solar Water Heater, 2 Car Parking"
        ),
        # 8. Bangalore - Rent - Flat
        Property(
            title="2 BHK Cozy Flat near Marathahalli Bridge",
            description="Perfect for IT professionals working in Outer Ring Road tech parks. Well-lit rooms, close to bus stops, supermarkets, and schools. Secure residential community.",
            city="Bangalore",
            locality="Marathahalli",
            price=32000.0,
            price_formatted="₹32,000/month",
            purpose="rent",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=1100,
            furnishing="Unfurnished",
            image_url="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
            amenities="24/7 Water Supply, Security Guard, Power Backup, Elevator, Two-wheeler Parking"
        ),
        # 9. Bangalore - Rent - Flat
        Property(
            title="1 BHK Penthouse Studio in Indiranagar",
            description="Exclusive rooftop penthouse studio with an expansive private terrace. Fully equipped kitchenette, modern bathroom, and tasteful furniture. Ultimate bachelor pad in Bangalore.",
            city="Bangalore",
            locality="Indiranagar",
            price=25000.0,
            price_formatted="₹25,000/month",
            purpose="rent",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=700,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
            amenities="Private Terrace, Smart TV, Wi-Fi Included, Washing Machine, AC, Power Backup"
        ),
        # 10. Bangalore - Rent - House
        Property(
            title="4 BHK Luxury House in Benson Town",
            description="Colonial-style independent heritage bungalow modernized with premium fittings. Features a massive wrap-around balcony, wooden flooring in the bedrooms, servant quarters, and huge lawns.",
            city="Bangalore",
            locality="Benson Town",
            price=120000.0,
            price_formatted="₹1.2 Lakh/month",
            purpose="rent",
            property_type="house",
            bhk=4,
            bathrooms=4,
            area=3200,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
            amenities="Huge Lawn, Servant Quarters, Wooden Flooring, Modern Bathrooms, CCTV Security"
        ),

        # --- MUMBAI PROPERTIES ---
        # 11. Mumbai - Buy - Flat
        Property(
            title="3 BHK Sea-Facing Apartment in Bandra West",
            description="Unobstructed views of the Arabian Sea from this luxury Bandra apartment. Premium Italian marble floors, floor-to-ceiling double-glazed windows, concierge services, and top-tier security systems.",
            city="Mumbai",
            locality="Bandra West",
            price=75000000.0,
            price_formatted="₹7.5 Crore",
            purpose="buy",
            property_type="flat",
            bhk=3,
            bathrooms=3,
            area=1900,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
            amenities="Sea View, Concierge, Gym, Valet Parking, Private Elevator, Smart Security"
        ),
        # 12. Mumbai - Buy - Flat
        Property(
            title="2 BHK Premium Flat in Andheri West",
            description="Located in a gated township, this modern 2 BHK flat features modular wardrobes, pipeline gas connection, high-speed elevators, and a luxurious clubhouse lobby. Excellent connectivity to metro and highway.",
            city="Mumbai",
            locality="Andheri West",
            price=24000000.0,
            price_formatted="₹2.4 Crore",
            purpose="buy",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=1100,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
            amenities="Clubhouse, Mini Theatre, Gated Entry, Jogging Track, Children's Pool, Piped Gas"
        ),
        # 13. Mumbai - Buy - House
        Property(
            title="4 BHK Luxury Bungalow in Juhu",
            description="Stunning 4 BHK independent bungalow situated in the elite residential neighborhood of Juhu. Features a private pool, indoor home elevator, basement parking for 3 cars, and premium wood accents throughout.",
            city="Mumbai",
            locality="Juhu",
            price=120000000.0,
            price_formatted="₹12 Crore",
            purpose="buy",
            property_type="house",
            bhk=4,
            bathrooms=4,
            area=4000,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            amenities="Private Pool, Home Lift, High ceilings, Basement Garage, Servant Rooms, Terrace Garden"
        ),
        # 14. Mumbai - Buy - Flat
        Property(
            title="3 BHK Sky Condominium in Worli",
            description="Luxurious apartment located in a iconic skyscraper in Worli. Enjoy 360-degree views of the Mumbai skyline and Sea Link. Fully loaded building with world-class wellness spa and indoor pool.",
            city="Mumbai",
            locality="Worli",
            price=68000000.0,
            price_formatted="₹6.8 Crore",
            purpose="buy",
            property_type="flat",
            bhk=3,
            bathrooms=3,
            area=1750,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            amenities="Sky Lounge, Spa & Sauna, Infinity Pool, Squash Courts, Helipad, Multi-tier Security"
        ),
        # 15. Mumbai - Buy - House
        Property(
            title="3 BHK Luxury Row House in Powai",
            description="A rare find in Mumbai: a beautiful row house with a private front porch and backyard garden. Located in Hiranandani Powai, this property offers serene hill views and peaceful neighborhood vibes.",
            city="Mumbai",
            locality="Powai",
            price=45000000.0,
            price_formatted="₹4.5 Crore",
            purpose="buy",
            property_type="house",
            bhk=3,
            bathrooms=3,
            area=2100,
            furnishing="Unfurnished",
            image_url="https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
            amenities="Row House Layout, Private Garden, Rooftop Deck, 24/7 Water, Covered Car Park"
        ),
        # 16. Mumbai - Rent - Flat
        Property(
            title="2 BHK Furnished Flat in Powai",
            description="Tastefully designed 2 BHK flat overlooking the Powai lake. It is loaded with modular appliances, custom beds and sofas, and automated lighting. Ready to move in.",
            city="Mumbai",
            locality="Powai",
            price=65000.0,
            price_formatted="₹65,000/month",
            purpose="rent",
            property_type="flat",
            bhk=2,
            bathrooms=2,
            area=980,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
            amenities="Lake View, Automated Lights, Intercom, Swimming Pool, Gym, Piped Gas"
        ),
        # 17. Mumbai - Rent - Flat
        Property(
            title="3 BHK Luxury Flat at Worli Sea Face",
            description="Gaze at the sunset over the sea link from your private balcony. This 3 BHK flat offers double-height lounge area, marble flooring, and customized walk-in wardrobe. Fully air-conditioned.",
            city="Mumbai",
            locality="Worli",
            price=180000.0,
            price_formatted="₹1.8 Lakh/month",
            purpose="rent",
            property_type="flat",
            bhk=3,
            bathrooms=3,
            area=1600,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80",
            amenities="Sea Face, Balcony, Central AC, Italian Marble, Home Cinema System, 2 Car Parks"
        ),
        # 18. Mumbai - Rent - House
        Property(
            title="3 BHK Independent House in Chembur",
            description="Well-maintained 3 BHK independent house in a secure gated enclave. Features a parking port, overhead water tanks with automatic pumps, and modular cupboards in all bedrooms.",
            city="Mumbai",
            locality="Chembur",
            price=9000.0,  # Wait, 90,000/month -> 90000.0
            price_formatted="₹90,000/month",
            purpose="rent",
            property_type="house",
            bhk=3,
            bathrooms=3,
            area=1800,
            furnishing="Semi-Furnished",
            image_url="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
            amenities="Independent Parking, Gated Community, 24/7 Water Supply, Terrace Access"
        ),
        # 19. Mumbai - Rent - Flat
        Property(
            title="1 BHK Cozy Apartment in Malad West",
            description="Excellent option for small families or working singles. Quiet society, minutes away from the link road and metro station. Piped gas connection and safety grill on windows.",
            city="Mumbai",
            locality="Malad West",
            price=28000.0,
            price_formatted="₹28,000/month",
            purpose="rent",
            property_type="flat",
            bhk=1,
            bathrooms=1,
            area=550,
            furnishing="Unfurnished",
            image_url="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
            amenities="Piped Gas, Near Metro, Elevator, Intercom Security, CCTV"
        ),
        # 20. Mumbai - Rent - House
        Property(
            title="5 BHK Sea-View Mansion in Bandra West",
            description="Stunning multi-level luxury house directly overlooking the sea in Carter Road, Bandra. Features an expansive terrace deck, smart elevator, high-security command post, private gym area, and lush green compound.",
            city="Mumbai",
            locality="Bandra West",
            price=450000.0,
            price_formatted="₹4.5 Lakh/month",
            purpose="rent",
            property_type="house",
            bhk=5,
            bathrooms=5,
            area=4800,
            furnishing="Fully Furnished",
            image_url="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
            amenities="Direct Sea View, Private Lift, Terrace Lounge, Private Gym room, Guard House, Piped Gas"
        )
    ]
    
    # Fix Chembur price typo (9000 -> 90000)
    for p in properties:
        if p.locality == "Chembur" and p.price == 9000.0:
            p.price = 90000.0
            
    db.add_all(properties)
    db.commit()
    db.close()
    print("Database successfully seeded with 20 properties!")

if __name__ == "__main__":
    seed_database()
