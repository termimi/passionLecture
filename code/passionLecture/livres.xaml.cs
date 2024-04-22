using System;
using System.IO;
using Aspose.Pdf;
using Aspose;
using static System.Reflection.Metadata.BlobBuilder;
using System.Reflection;
namespace passionLecture;

public partial class livres : ContentPage
{
	public livres()
	{
		InitializeComponent();
        //DisplayBooksArray();
	}

    

    public string[] GetBooks()
    {
       string bla = Directory.GetCurrentDirectory();
       string test = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        string folderPath = Path.Combine(Environment.CurrentDirectory, "Ressources/", "Images/", "livres/");

        if (Directory.Exists(folderPath))
        {
            string[] books = Directory.GetFiles(folderPath);
            return books;
        }
        else
        {
            List<string> errors = new List<string>();
            string error = "no books found";
            errors.Add(error);
            return errors.ToArray();
        }
    }
    public void DisplayBooksArray()
    {

        foreach (string book in GetBooks())
        {
            ImageButton bookCover = new ImageButton();
            bookCover.Source = "livres/"+book;
            booksPage.Children.Add(bookCover);
        }       
    }
    public void DisplayEbook(object sender, EventArgs e)
    {
        string bookPath = @"Resources\books\books\books\Dickens-Charles-Oliver-Twist.epub";
        Document epubBook = new Document("books/Dickens-Charles-Oliver-Twist.epub", new EpubLoadOptions());
    }
}