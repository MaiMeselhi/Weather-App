import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeTrip, updateTrip } from '../redux/tripSlice';

const TripHistory = () => {
  const trips = useSelector((state) => state.trips.trips);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState({ id: null, startDate: '', endDate: '' });

  // Function to handle deleting a trip
  const handleDelete = (id) => {
    dispatch(removeTrip(id)); // Delete trip
  };

  // Function to handle updating a trip
  const handleEditClick = (trip) => {
    setIsEditing(true);
    setEditedTrip({ id: trip.id, startDate: trip.startDate, endDate: trip.endDate });
  };

  // Function to handle form submission
  const handleUpdate = (e) => {
    e.preventDefault();
    if (editedTrip.startDate && editedTrip.endDate) {
      dispatch(updateTrip(editedTrip)); // Dispatch update
      setIsEditing(false); // Hide edit form after update
    }
  };

  // Function to handle input change for the update form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTrip((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='history'>
      <h2>Trip History</h2>
      {trips.length === 0 ? (
        <p>No trips saved.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip.id}>
              {trip.city} ({trip.startDate} - {trip.endDate})
              <button className="deleteBtn" onClick={() => handleDelete(trip.id)}>Delete</button>
              <button className="updateBtn" onClick={() => handleEditClick(trip)}>Update</button>
            </li>
          ))}
        </ul>
      )}

      {/* Conditional rendering of the update form */}
      {isEditing && (
        <div className="editForm">
          <h3>Update Trip</h3>
          <form onSubmit={handleUpdate}>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={editedTrip.startDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={editedTrip.endDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TripHistory;
