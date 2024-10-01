import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchRatingServiceServices } from '../../services/serviceServices';
import { FaStar } from 'react-icons/fa';
import Modal from 'react-modal';
import toast from 'react-hot-toast';

const RatingServiceComponent = ({
    serviceId,
    onRequestClose,
    onRatingSuccess,
}) => {
    const { authToken } = useContext(AuthContext);

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const handleRatingService = async (e) => {
        e.preventDefault();

        try {
            const data = await fetchRatingServiceServices(
                serviceId,
                rating,
                authToken
            );
            toast.success(data.message, {
                id: 'ok',
            });
            onRequestClose();
            onRatingSuccess();
        } catch (error) {
            toast.error(error.message, {
                id: 'error',
            });
        }
    };

    return (
        <form className='mx-auto' onSubmit={handleRatingService}>
            <fieldset>
                <section className='flex justify-center mt-4'>
                    {[...Array(5)].map((_, index) => {
                        const currentRating = index + 1;
                        return (
                            <div key={currentRating}>
                                <input
                                    type='radio'
                                    id={`star${currentRating}`}
                                    name='rating'
                                    value={currentRating}
                                    className='hidden'
                                    onClick={() => setRating(currentRating)}
                                />
                                <label
                                    htmlFor={`star${currentRating}`}
                                    className='cursor-pointer'
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                >
                                    <FaStar
                                        size={50}
                                        color={
                                            currentRating <= (hover || rating)
                                                ? '#ffc107'
                                                : '#e4e5e9'
                                        }
                                    />
                                </label>
                            </div>
                        );
                    })}
                </section>
                <div className='mx-auto'>
                    <button type='submit'>Valorar</button>
                </div>
            </fieldset>
        </form>
    );
};

const RatingModal = ({
    isOpen,
    onRequestClose,
    serviceId,
    onRatingSuccess,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className='modal-content'
        >
            <RatingServiceComponent
                serviceId={serviceId}
                onRequestClose={onRequestClose}
                onRatingSuccess={onRatingSuccess}
            />
        </Modal>
    );
};

export default RatingModal;
