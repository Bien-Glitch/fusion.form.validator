const modalWrapper = '#global-modal-wrapper';
const openModalButton = '.open-modal';

let _modalWrapper = $(modalWrapper),
    _openModalButton = $(openModalButton);

const openMultipleModals = (currentModal, callback) => callback(() => $(currentModal).onModalClose());
const modalEvents = () => {
    return new Promise(resolve =>
        $('.modal').each(function () {
            let _target = this,
                modalId = `#${$(_target).attr('id')}`;
            resolve({target: _target, id: modalId});
        })
    );
}

function loadModal({_wrapper, route, modal, button, options, beforeOpen, callback}) {
    _html.has(globalMessageTag) && _globalMessageTag.slideUp(800);
    _html.has(preloader) && _preloader.fadeIn(() => _body.addClass('overlay-shown'));
    $(button).has('.button-loader') && toggleButtonLoader($(button));


    return new Promise(resolve =>
        _wrapper.loadPageData({
            uri: route, overlay: overlay, beforeSend: beforeOpen, callback: () => {
                $(modal).onModalLoad(options, () => {
                    _preloader.fadeOut(() => _body.removeClass('overlay-shown'));
                    toggleButtonLoader($(button), true);
                    _openModalButton = $(openModalButton);
                    typeof callback === 'function' && callback();
                    resolve({modal: modal, route: route})
                })
            }
        })
    );
}

function onOpenModal({beforeOpen, options, callback}) {
    return new Promise(resolve =>
        _openModalButton.off().on('click', function (e) {
            e.preventDefault();
            let target = this,
                route = $(this).data('route'),
                modal = $(target).data('bs-target');
            resolve(loadModal({_wrapper: _modalWrapper, route: route, modal: modal, button: target, options: options, beforeOpen: beforeOpen, callback: callback}));
        })
    );
}
