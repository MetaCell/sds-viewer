import createTheme from '@material-ui/core/styles/createTheme';
import vars from './styles/constant';
import CURVE from './images/tree/curve.svg';
import LINE from './images/tree/linewithradius.svg';
import FILLED_FOLDER from './images/tree/filled-folder.svg';
import FILLED_FILE from './images/tree/filled-file.svg';
import FILLED_DATASET from './images/tree/filled-dataset.svg';
import DATASET from './images/tree/dataset.svg';
import FOLDER from './images/tree/folder.svg';
import FILE from './images/tree/file.svg';

const {
  primaryColor,
  secondaryColor,
  primaryTextColor,
  lightBorderColor,
  radius,
  primaryColorHover,
  whiteColor,
  outlinedButtonHover,
  primaryBgColor,
  inputTextColor,
  scrollbarBg,
  iconButtonHover,
  primaryTransition,
  fontFamily,
  barSuccessColor,
  noInstanceColor,
  gutter,
  errorColor,
  tabsBgColor,
  progressBgPrimary,
  dropzoneBorderColor,
  dropzoneTextColor,
  inputFocusShadow,
  successInputFocusShadow,
  placeHolderColor,
  dialogShadow,
  tabsBorderColor,
  dialogBodyBgColor,
  sideBarTextColor,
  sideBarLabelColor,
  chipBgColor,
  progressErrorBg,
  treeBorderColor,
} = vars;

const theme = createTheme({
  typography: {
    fontFamily,
    h3: {
      fontWeight: '600',
      fontSize: '1.5rem',
      lineHeight: '1.8125rem',
      color: primaryTextColor,
    },
  },

  overrides: {
    MuiBreadcrumbs: {
      root: {
        marginTop: '.25rem',
      },
      ol: {
        lineHeight: 1,
      },
      separator: {
        marginLeft: '.25rem',
        marginRight: '.25rem',
        color: dropzoneTextColor,
      },
      li: {
        fontSize: '.75rem',
        lineHeight: '.875rem',
        letterSpacing: '.00375rem',
        fontWeight: '500',
        color: dropzoneTextColor,
        '& a': {
          color: primaryColor,
        },
        '& p': {
          fontSize: '.75rem',
          lineHeight: '.875rem',
          letterSpacing: '.00375rem',
          fontWeight: '500',
          color: dropzoneTextColor,
        },
      },
    },
    MuiChip: {
      root: {
        backgroundColor: chipBgColor,
        borderRadius: '.3125rem',
        display: 'inline-flex',
        alignItems: 'center',
        height: '1.375rem',
        marginTop: '.25rem',
        marginRight: '.375rem',
        '& .MuiChip-label': {
          padding: '0 .375rem',
          fontSize: '.75rem',
          color: primaryTextColor,
        },
      },
    },
    MuiCircularProgress: {
      colorPrimary: {
        color: whiteColor,
      },
    },
    MuiLinearProgress: {
      root: {
        borderRadius: '.125rem',
      },
      colorPrimary: {
        backgroundColor: progressBgPrimary,
      },
      colorSecondary: {
        backgroundColor: progressBgPrimary,
      },
      barColorPrimary: {
        backgroundColor: primaryColor,
        borderRadius: '.25rem',
      },
      barColorSecondary: {
        backgroundColor: barSuccessColor,
        borderRadius: '.25rem',
      },
    },
    MuiDropzoneArea: {
      root: {
        borderWidth: '0.09375rem',
        borderColor: dropzoneBorderColor,
        borderRadius: '.5rem',
        height: '8.75rem',
        minHeight: '8.75rem',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '& + .uploaded-files': {
          marginTop: '1rem',
        },

        '&.hide': {
          display: 'none',
        },

        '& .MuiDropzoneArea-textContainer': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiDropzoneArea-text': {
            margin: '0',
            fontWeight: '600',
            fontSize: '.75rem',
            lineHeight: '.875rem',
            letterSpacing: '-0.01em',
            order: 2,
            marginTop: '.6875rem',
            color: dropzoneTextColor,
          },
          '& svg': {
            color: primaryColor,
          },
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        backgroundColor: whiteColor,
        borderRadius: '.5rem',
        '&.Mui-disabled': {
          color: dropzoneTextColor,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent',
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderWidth: '.0625rem',
            borderColor: primaryColor,
            boxShadow: `0 0 0 .1875rem ${inputFocusShadow}`,
          },
        },
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: primaryColor,
          },
        },

        '&.field-success': {
          '& .MuiOutlinedInput-input': {
            color: barSuccessColor,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: barSuccessColor,
          },
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: barSuccessColor,
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: '.0625rem',
              borderColor: barSuccessColor,
              boxShadow: `0 0 0 .1875rem ${successInputFocusShadow}`,
            },
          },
        },
      },

      notchedOutline: {
        borderColor: 'transparent',
      },
      input: {
        fontSize: '.75rem',
        letterSpacing: '-0.01em',
        padding: '.75rem 0',
        '&::placeholder': {
          color: placeHolderColor,
        },
      },
      adornedStart: {
        paddingLeft: '.75rem',
        '& .MuiInputAdornment-root': {
          marginTop: '0 !important',
        },
      },
      adornedEnd: {
        paddingRight: '.75rem',
      },
    },
    MuiDialog: {
      paperWidthSm: {
        width: '25rem',
        borderRadius: '.75rem',
        boxShadow: `0 .25rem 3.125rem ${dialogShadow}`,
      },
    },
    MuiTabs: {
      root: {
        minHeight: '.0625rem',
        '&:not(.rounded)': {
          borderTop: `.0625rem solid ${tabsBorderColor}`,
          borderBottom: `.0625rem solid ${tabsBorderColor}`,
          padding: gutter + 2,
        },

        '&.rounded': {
          boxShadow: `inset 0 0 .125rem ${dialogShadow}`,
          background: tabsBgColor,
          padding: '.25rem .3125rem',
          borderRadius: '2.5rem',
          width: '14.75rem',
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
        },

        '& .MuiTabs-indicator': {
          display: 'none !important',
        },
      },
    },
    MuiTab: {
      root: {
        minWidth: '.0625rem !important',
        textTransform: 'none',
        minHeight: '.0625rem',
        '&:not(.rounded)': {
          padding: '.5rem',
          borderRadius: radius,
          fontWeight: 500,
          fontSize: '1.125rem',
          lineHeight: '1.375rem',
          letterSpacing: '-0.03em',
          color: `${primaryTextColor} !important`,
          '&:not(.Mui-selected)': {
            opacity: 0.4,
          },
        },
        '&.rounded': {
          width: '50%',
          padding: 0,
          fontSize: '.75rem',
          lineHeight: '.875rem',
          borderRadius: '2.5rem',
          height: '2.25rem',
          textAlign: 'center',
          letterSpacing: '-0.01em',
          color: primaryColor,
          '&:not(.Mui-selected)': {
            opacity: 1,
          },
          '&.Mui-selected': {
            background: primaryColor,
            color: whiteColor,
          },
        },
      },
    },
    MuiFilledInput: {
      root: {
        fontFamily,
        backgroundColor: lightBorderColor,
        height: '2.375rem',
        borderRadius: `${radius}px !important`,
        paddingRight: `0.4375rem !important`,
        '&:hover': {
          backgroundColor: lightBorderColor,
        },
        '& .MuiInputAdornment-positionStart': {
          marginTop: `0 !important`,
        },
      },
      input: {
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: '0.75rem',
        letterSpacing: '-0.01em',
        color: inputTextColor,
        '&::placeholder': {
          color: inputTextColor,
        },
      },
      adornedEnd: {
        '& .MuiButton-root': {
          padding: '0.3125rem',
          minWidth: 1,
          fontSize: '0.75rem',
          fontWeight: '600',
          height: 'auto',
          color: whiteColor,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: 0,
        borderRadius: radius,
        backgroundColor: lightBorderColor,
        '&:hover': {
          backgroundColor: iconButtonHover,
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: radius,
        height: '2.375rem',
        padding: 0,
        minWidth: '9.875rem',
      },
      label: {
        textTransform: 'none',
        display: 'flex',
        '& img': {
          marginRight: '.25rem',
        },
      },
      containedPrimary: {
        backgroundColor: primaryColor,
        '&:hover': {
          backgroundColor: primaryColorHover,
        },

        '&.Mui-disabled': {
          backgroundColor: dropzoneBorderColor,
          color: whiteColor,
        },
      },
      outlinedPrimary: {
        borderColor: primaryColor,
        color: primaryColor,
        '&:hover': {
          backgroundColor: outlinedButtonHover,
        },
      },
    },
    MuiCssBaseline: {
      '@global': {
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        ' body': {
          backgroundColor: secondaryColor,
        },
        '.main-structure': {
          display: 'flex',
          overflow: 'hidden',
        },
        '.scrollbar': {
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '0.25rem',

            '&:horizontal': {
              height: '0.25rem',
            },
          },
          '&::-webkit-scrollbar-thumb': {
            background: scrollbarBg,
            borderRadius: '.25rem',
          },
        },
        '.noscrollbar': {
          overflow: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.dialog': {
          '&_body': {
            background: dialogBodyBgColor,
            padding: '1rem',
            '& .MuiButton-root': {
              marginTop: '.75rem',
            },
          },
          '&_header': {
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '3rem',
            '& img': {
              cursor: 'pointer',
              marginLeft: 'auto',
              width: 'auto',
              marginBottom: '.1875rem',
            },
            '& h3': {
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '1.8125rem',
              textAlign: 'center',
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
              color: primaryTextColor,
            },
          },
        },
        '.sidebar': {
          width: '18.75rem',
          overflow: 'hidden',
          backgroundColor: secondaryColor,
          height: '100vh',
          flexShrink: 0,
          padding: '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          transition: primaryTransition,
          '&.shrink': {
            width: '4.125rem',
            transition: primaryTransition,
            '& .sidebar': {
              '&-header': {
                '&> img': {
                  marginBottom: '1.1875rem',
                  paddingBottom: '1.1875rem',
                  borderBottom: `0.0625rem solid ${lightBorderColor}`,
                },
              },
              '&-body': {
                '& ul': {
                  display: 'none',
                },
              },
              '&-footer': {
                '& .MuiButton-root': {
                  '& img': {
                    margin: '0',
                  },
                },
              },
            },
            '& .MuiButtonBase-root': {
              padding: 0,
              width: '2.25rem',
              minWidth: '0.0625rem',
              fontSize: 0,
              margin: '0 auto',
              display: 'block',
              height: '2.25rem',
            },
          },
          '&:not(.shrink)': {
            '& .sidebar': {
              '&-header': {
                '& .MuiIconButton-root': {
                  backgroundColor: 'transparent',
                },
                '& .MuiFormControl-root': {
                  marginTop: '0.875rem',
                },
              },
              '&-footer': {
                '& .MuiIconButton-root': {
                  width: '1rem',
                  height: '1rem',
                  borderRadius: radius - 4,
                },
                '& .MuiButton-contained': {
                  width: '100%',
                  '& img': {
                    marginRight: '0.3125rem',
                  },
                },
              },
            },
          },
          '&-header': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1.1875rem',
            borderBottom: `0.0625rem solid ${lightBorderColor}`,
            flexWrap: 'wrap',
            '&> img': {
              cursor: 'pointer',
              maxWidth: '100%',
              transition: primaryTransition,
            },
          },
          '&-body': {
            padding: '1.1875rem 0.75rem',
            height: 'calc(100% - 14.0625rem)',
            margin: '0 -0.75rem',
            flexGrow: 1,
            position: 'relative',

            '&::before': {
              content: '""',
              position: 'absolute',
              right: '0.75rem',
              bottom: '.5rem',
              width: '.25rem',
              height: '.25rem',
              background: secondaryColor,
              zIndex: '9999',
            },

            '& .MuiTreeItem-root > .MuiTreeItem-content .MuiTreeItem-label': {
              borderRadius: '.5rem',
              background: 'transparent',
              border: '0.03125rem solid transparent',
              minWidth: '10rem',
            },

            '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label': {
              background: `linear-gradient(0deg, ${lightBorderColor}, ${lightBorderColor}), ${secondaryColor}`,
              borderColor: primaryColor,
            },

            '& .MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, & .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label': {
              background: `linear-gradient(0deg, ${lightBorderColor}, ${lightBorderColor}), ${secondaryColor}`,
              borderColor: primaryColor,
            },

            '& .MuiTreeItem-content': {
              position: 'relative',
              zIndex: '1',
            },

            '& .MuiTreeItem-root': {
              '&.Mui-selected > .MuiTreeItem-content .dataset .labelIcon': {
                backgroundImage: `url(${FILLED_DATASET})`,
              },
              '&.Mui-selected > .MuiTreeItem-content .file .labelIcon': {
                backgroundImage: `url(${FILLED_FILE})`,
              },
              '&.Mui-selected > .MuiTreeItem-content .folder .labelIcon': {
                backgroundImage: `url(${FILLED_FOLDER})`,
              },
              '& .dataset': {
                '& .labelIcon': {
                  width: '0.75rem',
                  height: '0.8125rem',
                  fontSize: 0,
                  backgroundImage: `url(${DATASET})`,
                },
              },
              '& .file': {
                '& .labelIcon': {
                  width: '0.6875rem',
                  height: '0.875rem',
                  fontSize: 0,
                  backgroundImage: `url(${FILE})`,
                },
              },
              '& .folder': {
                '& .labelIcon': {
                  height: '0.75rem',
                  width: '0.9375rem',
                  fontSize: 0,
                  backgroundImage: `url(${FOLDER})`,
                },
              },
            },

            '& .labelRoot': {
              display: 'flex',
              alignItems: 'center',
              padding: '0.5625rem 0.6875rem',
            },
            '& .labelIcon': {
              marginRight: '0.625rem',
              flexShrink: 0,
            },
            '& .labelText': {
              fontWeight: 'normal',
              flexGrow: 1,
              fontSize: '0.8125rem',
              lineHeight: '1rem',
              color: whiteColor,
            },
            '& .MuiTreeItem-group': {
              paddingLeft: '1.4375rem',
              margin: 0,
            },
            '& .labelCaption': {
              height: '1rem',
              backgroundColor: lightBorderColor,
              padding: '0 0.25rem',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '0.625rem',
              lineHeight: '0.75rem',
              minWidth: '2rem',
              justifyContent: 'center',
              color: noInstanceColor,
              letterSpacing: '-0.01em',
              '& img': {
                marginLeft: '0.125rem',
              },
            },
            '& .scrollbar': {
              overflow: 'auto',
              height: 'calc(100% - 1rem)',
            },
            '& h3': {
              fontWeight: '600',
              fontSize: '0.75rem',
              lineHeight: '0.9375rem',
              letterSpacing: '-0.01em',
              marginBottom: '0.75rem',
              color: whiteColor,
              padding: '0 0.6875rem',
            },
            '& .MuiTreeView-root': {
              '& .MuiTreeItem-root': {
                '& .MuiTreeItem-group': {
                  '& .MuiCollapse-wrapperInner': {
                    '& .MuiTreeItem-root': {
                      '&.Mui-expanded': {
                        '& .labelCaption': {
                          '& img': {
                            transform: 'rotate(-180deg)',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            '& ul': {
              position: 'relative',
              '&::before': {
                content: '""',
                height: 'calc(100% - 0.85rem)',
                width: '0.0625rem',
                position: 'absolute',
                left: '1.0625rem',
                borderRadius: '3.125rem',
                top: '-0.5625rem',
                backgroundImage: `url(${LINE})`,
                backgroundRepeat: 'repeat',
              },
              '& .MuiTreeItem-root': {
                position: 'relative',
                '&::before': {
                  content: '""',
                  height: '0.875rem',
                  width: '1.4375rem',
                  backgroundImage: `url(${CURVE})`,
                  position: 'absolute',
                  top: '0.75rem',
                  backgroundRepeat: 'no-repeat',
                  left: '-0.375rem',
                },
                '&::after': {
                  content: '""',
                  height: '0.0625rem',
                  borderRadius: '3.125rem',
                  width: '0.5rem',
                  backgroundColor: treeBorderColor,
                  position: 'absolute',
                  left: '0',
                  top: '1.0625rem',
                  display: 'none',
                },
                '&:hover': {
                  background: 'transparent',
                },
                '&:focus > .MuiTreeItem-content': {
                  backgroundColor: 'transparent',
                },
              },
            },
            '& .scrollbar > .MuiTreeView-root': {
              '&::before': {
                display: 'none',
              },
              '& .MuiTreeItem-label': {
                paddingLeft: '0',
                '&:hover': {
                  background: 'transparent',
                },
                '&:focus': {
                  backgroundColor: 'transparent',
                },
              },
              '& .MuiTreeItem-iconContainer': {
                display: 'none',
              },
              '&> .MuiTreeItem-root': {
                '&::before': {
                  display: 'none',
                },
                '&::after': {
                  display: 'none',
                },
                '&:hover': {
                  background: 'transparent',
                },
                '&:focus > .MuiTreeItem-content': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-expanded': {
                  '&> .MuiTreeItem-content': {
                    '&> .MuiTreeItem-label': {
                      '&> div': {
                        '& span': {
                          '& img': {
                            transform: 'rotate(-180deg)',
                          },
                        },
                      },
                    },
                  },
                },
                '& .MuiTreeItem-content': {
                  '&:hover': {
                    background: 'transparent',
                  },
                },
                '&> .MuiTreeItem-content': {
                  '&> .MuiTreeItem-label': {
                    '&> div': {
                      '& p': {
                        fontSize: '0.75rem',
                        lineHeight: '0.9375rem',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      },
                    },
                  },
                },
              },
            },

            '& .no-instance': {
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontWeight: '600',
              letterSpacing: '-0.01em',
              color: noInstanceColor,
              textAlign: 'center',
            },
          },
          '&-footer': {
            boxShadow: `0 -4.75rem 3.0625rem -2.5625rem ${secondaryColor}`,
            borderTop: `0.0625rem solid ${lightBorderColor}`,
            paddingTop: '1rem',
            position: 'relative',
            zIndex: '2',
            '& .MuiButton-contained': {
              minHeight: '2.375rem',
              padding: 0,
              width: '100%',
              '& .MuiButton-label': {
                display: 'flex',
              },
            },
            '& .support': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '1rem',
              height: '3.3125rem',
              borderTop: `0.0625rem solid ${lightBorderColor}`,
              '& p': {
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.75rem',
                letterSpacing: '-0.01em',
                color: vars.whiteColor,
                fontWeight: '400',
                '& img': {
                  marginRight: '0.625rem',
                },
              },
            },
          },
        },
        '.content': {
          backgroundColor: primaryBgColor,
          flexGrow: 1,
          borderRight: `.0625rem solid ${tabsBorderColor}`,
          padding: '1rem',
          '&:not(.full-round)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: 'none',
          },
        },
        '.MuiBox-empty': {
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          flexDirection: 'column',
          '& h3': {
            marginBottom: '1.5rem',
          },
        },
        '.uploaded-files': {
          '&_row': {
            background: whiteColor,
            borderRadius: '.5rem',
            display: 'flex',
            alignItems: 'center',
            padding: '.5rem',
            marginTop: '.5rem',
            '&.error': {
              '& .MuiLinearProgress-colorSecondary': {
                backgroundColor: progressErrorBg,
              },
              '& p': {
                color: errorColor,
              },
              '& strong': {
                color: errorColor,
              },
            },
            '& .wrap': {
              padding: '0 0.9375rem',
              flexGrow: '1',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',

              '& .MuiLinearProgress-root': {
                width: '100%',
                marginTop: '.3125rem',
              },

              '& p': {
                fontWeight: '600',
                fontSize: '.75rem',
                lineHeight: '.875rem',
                letterSpacing: '-0.01em',
                color: sideBarTextColor,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                maxWidth: '6.25rem',
              },
              '& span': {
                fontWeight: '600',
                fontSize: '.75rem',
                lineHeight: '.875rem',
                letterSpacing: '-0.01em',
                color: dropzoneTextColor,
              },
              '& strong': {
                fontWeight: '600',
                fontSize: '.75rem',
                lineHeight: '.875rem',
                letterSpacing: '-0.01em',
                color: barSuccessColor,
              },
            },
            '& img': {
              flexShrink: '0',
            },
          },
          '& h3': {
            fontWeight: '600',
            fontSize: '.75rem',
            lineHeight: '.875rem',
            letterSpacing: '-0.01em',
            marginBottom: '1rem',
            color: dropzoneTextColor,
          },
        },

        '.secondary-sidebar': {
          width: '100%',
          display: 'flex',
          flexShrink: 0,
          flexDirection: 'column',
          backgroundColor: whiteColor,
          position: 'relative',
          transition: 'all ease-in-out .3s',

          '&:not(.in)': {
            marginRight: '-18.75rem',
            transition: 'all ease-in-out .3s',
          },
          '&_body': {
            flexGrow: 1,
            height: 'calc(100vh - 18rem)',
            overflow: 'auto',
            paddingBottom: '5rem',
          },
          '&_footer': {
            display: 'none',
            height: '5rem',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            right: '0',
            bottom: '0',
            width: '18.75rem',
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, ${whiteColor} 100%)`,
            '& img': {
              cursor: 'pointer',
            },
          },

          '&.in': {
            '& .secondary-sidebar_footer': {
              display: 'flex',
            },
          },
          '&::before': {
            content: '""',
            background: whiteColor,
            width: '1.875rem',
            top: 0,
            left: '-1.875rem',
            height: '1.875rem',
            position: 'absolute',
            zIndex: -1,
          },
          '&::after': {
            content: '""',
            background: whiteColor,
            width: '1.875rem',
            left: '-1.875rem',
            bottom: 0,
            height: '1.875rem',
            position: 'absolute',
            zIndex: -1,
          },
          '&_header': {
            textAlign: 'center',
            padding: '1.5rem 1.5rem 2.25rem',
            borderBottom: `.0625rem solid ${tabsBorderColor}`,
            '& .MuiBreadcrumbs-li a': {
              color: placeHolderColor,
            },
            '& .MuiBreadcrumbs-separator': {
              margin: '0 .5rem',
            },
            '& .wrap': {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2.25rem',
              '& img': {
                margin: '0',
                cursor: 'pointer',
              },
            },
            '& img': {
              display: 'block',
              margin: '0 auto',
            },
            '& h3': {
              fontWeight: '600',
              fontSize: '1.5rem',
              lineHeight: '1.8125rem',
              marginBottom: '.25rem',
              marginTop: '.75rem',
            },
            '&> p ': {
              fontWeight: '500',
              fontSize: '.75rem',
              lineHeight: '.875rem',
              letterSpacing: '-0.01em',
              color: placeHolderColor,
            },
          },

          '& .tab-content': {
            padding: '1.5rem',
            '&+ .tab-content': {
              borderTop: `.0625rem solid ${tabsBorderColor}`,
            },
            '& h3': {
              fontSize: '1.125rem',
              fontWeight: '500',
              lineHeight: '1.375rem',
              letterSpacing: '-0.03em',
              color: 'primaryTextColor',
              marginBottom: '1.5625rem',
            },
            '& .tab-content-row': {
              '& .chip-overflow': {
                whiteSpace: 'nowrap',
                overflow: 'auto',
                marginRight: '-1.5rem',
              },
              '&> a': {
                display: 'inline-flex',
                fontSize: '.75rem',
                lineHeight: '1rem',
                marginTop: '.25rem',
                color: primaryColor,

                '&:not(:last-child)': {
                  marginRight: '.75rem',
                },

                '& img': {
                  marginRight: '.25rem',
                },
              },
              '&+ .tab-content-row': {
                marginTop: '1.5rem',
              },
              '& label': {
                fontWeight: '600',
                display: 'block',
                fontSize: '.75rem',
                lineHeight: '.875rem',
                letterSpacing: '-0.01em',
                color: sideBarLabelColor,
                '&+ p': {
                  marginTop: '.25rem',
                },
              },
              '&> p': {
                fontSize: '.75rem',
                lineHeight: '1rem',
                color: primaryTextColor,
              },

              '& .MuiList-root': {
                padding: '0',
                '& .MuiListItemText-root': {
                  margin: '0',
                  '&+ .MuiListItemText-root': {
                    marginTop: '.5rem',
                  },
                  '&>span': {
                    display: 'flex',
                    '& label': {
                      width: '9.5rem',
                      paddingRight: '.5rem',
                      '&+ p': {
                        fontSize: '.75rem',
                        lineHeight: '1rem',
                        marginTop: '0',
                        color: primaryTextColor,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '.custom-chips': {
          display: 'flex',
          marginTop: '.25rem',
          overflow: 'auto',
          '&_col': {
            display: ' flex',
            flexShrink: 0,
            background: primaryBgColor,
            borderRadius: '.5rem',
            padding: '.5rem .75rem 0.5rem 0.5rem',
            '&:not(:last-child)': {
              marginRight: '.5rem',
            },
            '& img': {
              flexShrink: 0,
              marginRight: '.25rem',
            },
            '& .wrap': {
              whiteSpace: 'nowrap',
              '& strong': {
                display: 'block',
                lineHeight: '.875rem',
                fontSize: '.75rem',
                color: primaryTextColor,
              },
              '& span': {
                display: 'block',
                lineHeight: '.875rem',
                fontSize: '.75rem',
                color: placeHolderColor,
              },
            },
          },
        },
        '.graph-view': {
          height: '100%',
        },
        '.graph-view_controls': {
          width: '.75rem',
          position: 'absolute',
          bottom: '0',
          zIndex: '100',
        },
      },
    },
  },
});

export default theme;
