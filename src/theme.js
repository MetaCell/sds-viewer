import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import vars from './styles/constant';

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
} = vars;

const theme = createMuiTheme({
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
            padding: '1.1875rem 0',
            flexGrow: 1,
            borderBottom: `0.0625rem solid ${lightBorderColor}`,
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
            paddingTop: '1rem',
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
          borderRadius: radius * 2,
          flexGrow: 1,
          borderRight: `.0625rem solid ${tabsBorderColor}`,
          '&:not(.full-round)': {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
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
        '.scrollbar': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
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
                backgroundColor: 'rgb(251, 158, 191)',
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
      },
    },
  },
});

export default theme;
