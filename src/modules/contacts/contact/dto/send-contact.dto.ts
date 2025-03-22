import { minLength, object, string, maxLength, Output, email } from 'valibot';


const SendContactDto = object({
    fullName: string('Name and Surname must be a string.', [
        minLength(
            1,
            'Please enter Name and Surname',
        ),
        maxLength(
            255,
            'Please enter Name and Surname with a maximum length of 255 characters.',
        ),
    ]),
    
    email: string('Email must be a string.', [
        minLength(1, 'Please enter Email'),
        maxLength(
        255,
        'Please enter Email with a maximum length of 255 characters.',
        ),
        email('Invalid email format.'),
    ]),

    message: string('Messages must be a string.', [
        minLength(1, 'Please enter Messages'),
        maxLength(
        1000,
        'Please enter Messages with a maximum length of 1000 characters.',
        ),
    ]),
});

type SendContactDtoType = Output<typeof SendContactDto>;

export { SendContactDto, SendContactDtoType };
